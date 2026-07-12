/* src/admin/hooks/useContacts.ts */
import { useState, useEffect, useMemo } from 'react';
import { ContactSubmission } from '../types/contact';
import { contactService } from '../services/contactService';

export const useContacts = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all'); // 'all' | 'open' | 'reply_pending' | 'replied'
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);

  // Fetch data on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadSubmissions = async () => {
      setIsLoading(true);
      try {
        const data = await contactService.getSubmissions();
        if (isMounted) {
          setSubmissions(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to fetch contact submissions.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSubmissions();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter submissions by status and search queries
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      // Status check
      const matchesStatus = 
        statusFilter === 'all' || 
        sub.status === statusFilter;

      // Search match (name, email, subject, company, message)
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        sub.name.toLowerCase().includes(query) ||
        sub.email.toLowerCase().includes(query) ||
        sub.subject.toLowerCase().includes(query) ||
        sub.company.toLowerCase().includes(query) ||
        sub.message.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [submissions, statusFilter, searchQuery]);

  // Compute status summary aggregates
  const stats = useMemo(() => {
    const total = submissions.length;
    const open = submissions.filter(s => s.status === 'open').length;
    const pending = submissions.filter(s => s.status === 'reply_pending').length;
    const replied = submissions.filter(s => s.status === 'replied').length;
    
    return {
      total,
      open,
      pending,
      replied,
      awaitingReply: open + pending
    };
  }, [submissions]);

  // Handle pagination indexing slice
  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredSubmissions.slice(startIndex, endIndex);
  }, [filteredSubmissions, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / pageSize));

  // Reset page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, pageSize]);

  return {
    submissions: paginatedSubmissions,
    allFilteredCount: filteredSubmissions.length,
    stats,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages
  };
};

export default useContacts;
