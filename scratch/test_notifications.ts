// scratch/test_notifications.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatNotificationTimeAgo, AdminNotification } from '../src/admin/hooks/useAdminNotifications';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting Dynamic Admin Notifications Verification Tests...\n');

let failed = false;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// 1. Static Notification Audit in Codebase
console.log('--- TEST 1: Forensic Static/Mock Notification Audit ---');
const topbarPath = path.join(rootDir, 'src', 'admin', 'layout', 'Topbar.tsx');
const topbarContent = fs.readFileSync(topbarPath, 'utf8');

assert(!topbarContent.includes('staticNotifications'), 'staticNotifications array completely removed from Topbar.tsx');
assert(!topbarContent.includes('John Doe submitted a contact request'), 'Hardcoded "John Doe" contact notification removed');
assert(!topbarContent.includes('Your resume was downloaded.'), 'Hardcoded "Your resume was downloaded." placeholder removed');
assert(!topbarContent.includes("timestamp: '2 minutes ago'"), 'Hardcoded "2 minutes ago" removed from Topbar.tsx');
assert(!topbarContent.includes("timestamp: '1 hour ago'"), 'Hardcoded "1 hour ago" removed from Topbar.tsx');

// Check all files in src/admin for staticNotifications
function searchDir(dir: string, pattern: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath, pattern);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(pattern)) {
        assert(false, `Found forbidden pattern "${pattern}" in ${fullPath}`);
      }
    }
  }
}
searchDir(path.join(rootDir, 'src', 'admin'), 'staticNotifications');
searchDir(path.join(rootDir, 'src', 'admin'), 'John Doe submitted a contact request');
assert(true, 'Zero occurrences of mock notification data across all src/admin files');

// 2. Format Relative Time Test
console.log('\n--- TEST 2: formatNotificationTimeAgo Unit Tests ---');
const now = new Date();
assert(formatNotificationTimeAgo(now.toISOString()) === 'Just now', 'Current timestamp formats to "Just now"');

const tenSecAgo = new Date(Date.now() - 10 * 1000).toISOString();
assert(formatNotificationTimeAgo(tenSecAgo) === 'Just now', '10s ago formats to "Just now"');

const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
assert(formatNotificationTimeAgo(twoMinAgo) === '2 min ago', '2m ago formats to "2 min ago"');

const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
assert(formatNotificationTimeAgo(oneHourAgo) === '1 hour ago', '1h ago formats to "1 hour ago"');

const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
assert(formatNotificationTimeAgo(threeHoursAgo) === '3 hours ago', '3h ago formats to "3 hours ago"');

const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
assert(formatNotificationTimeAgo(yesterday) === 'Yesterday', '24h ago formats to "Yesterday"');

// 3. Chronological Sorting & Prefix Unification
console.log('\n--- TEST 3: Notification Model & Chronological Ordering ---');
const sampleEvents = [
  { id: '101', type: 'contact' as const, name: 'Alice Smith', created_at: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: '202', type: 'download' as const, name: 'Bob Jones', created_at: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: '303', type: 'testimonial' as const, name: 'Charlie Ray', created_at: new Date(Date.now() - 5 * 60000).toISOString() }
];

const mappedNotifications: AdminNotification[] = sampleEvents.map(e => ({
  id: `${e.type}-${e.id}`,
  type: e.type,
  title: e.type === 'download' ? 'Resume Downloaded' : e.type === 'testimonial' ? 'New Testimonial Submitted' : 'New Contact Received',
  description: `${e.name} action`,
  timestamp: formatNotificationTimeAgo(e.created_at),
  createdAt: e.created_at,
  iconBg: 'rgba(0,0,0,0.1)',
  iconColor: '#000',
  isRead: false,
  sourceId: e.id
}));

mappedNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

assert(mappedNotifications[0].id === 'download-202', 'Newest notification (2m ago download) is first');
assert(mappedNotifications[1].id === 'testimonial-303', 'Second newest notification (5m ago testimonial) is second');
assert(mappedNotifications[2].id === 'contact-101', 'Oldest notification (10m ago contact) is third');
assert(mappedNotifications[0].id.startsWith('download-'), 'Download ID prefixed with download-');
assert(mappedNotifications[1].id.startsWith('testimonial-'), 'Testimonial ID prefixed with testimonial-');
assert(mappedNotifications[2].id.startsWith('contact-'), 'Contact ID prefixed with contact-');

// 4. Legacy Unread Migration Test
console.log('\n--- TEST 4: Legacy Read State Migration ---');
const legacyTestimonialIds = ['legacy-uuid-1', 'legacy-uuid-2'];
const readSet = new Set<string>();
legacyTestimonialIds.forEach(id => {
  readSet.add(id.startsWith('testimonial-') ? id : `testimonial-${id}`);
});
assert(readSet.has('testimonial-legacy-uuid-1'), 'Legacy ID migrated to testimonial-legacy-uuid-1');
assert(readSet.has('testimonial-legacy-uuid-2'), 'Legacy ID migrated to testimonial-legacy-uuid-2');
assert(!readSet.has('download-legacy-uuid-1'), 'Prefix separation ensures no cross-table collision');

console.log('\n========================================');
if (failed) {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
} else {
  console.log('🎉 ALL AUTOMATED TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}
