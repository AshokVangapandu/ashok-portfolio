import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase/client';
import { Database } from '../../lib/supabase/types';

export type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];

interface FetchMessagesOptions {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
}

export const useContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filteredCount, setFilteredCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTotalCount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { count, error: countErr } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true });

      if (countErr) throw countErr;
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error('[useContactMessages] Error fetching total count:', err);
      setError(err.message || 'Failed to fetch messages count.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecentMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (fetchErr) throw fetchErr;
      setRecentMessages(data || []);
    } catch (err: any) {
      console.error('[useContactMessages] Error fetching recent messages:', err);
      setError(err.message || 'Failed to fetch recent messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (options: FetchMessagesOptions) => {
    const { page, pageSize, sortBy, sortOrder, searchQuery } = options;
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('contact_messages')
        .select('*', { count: 'exact' });

      if (searchQuery.trim()) {
        const queryStr = `%${searchQuery.trim()}%`;
        query = query.or(`full_name.ilike.${queryStr},email.ilike.${queryStr},subject.ilike.${queryStr}`);
      }

      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error: queryErr } = await query;

      if (queryErr) throw queryErr;
      setMessages(data || []);
      setFilteredCount(count || 0);
    } catch (err: any) {
      console.error('[useContactMessages] Error fetching messages:', err);
      setError(err.message || 'Failed to fetch messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMessage = useCallback(async (id: string) => {
    setError(null);
    try {
      const { error: delErr } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (delErr) throw delErr;
      
      // Update local state counts
      setTotalCount((prev) => Math.max(0, prev - 1));
      setFilteredCount((prev) => Math.max(0, prev - 1));
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setRecentMessages((prev) => prev.filter((m) => m.id !== id));
      
      return true;
    } catch (err: any) {
      console.error('[useContactMessages] Error deleting message:', err);
      setError(err.message || 'Failed to delete message.');
      return false;
    }
  }, []);

  return {
    messages,
    recentMessages,
    totalCount,
    filteredCount,
    loading,
    error,
    fetchTotalCount,
    fetchRecentMessages,
    fetchMessages,
    deleteMessage,
  };
};
