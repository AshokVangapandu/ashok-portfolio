/* src/admin/services/contactExportService.ts */
import { ContactSubmission } from '../types/contact';

export interface Exporter {
  exportData(data: ContactSubmission[], filename: string): void;
}

class CSVExporter implements Exporter {
  exportData(data: ContactSubmission[], filename: string): void {
    const headers = [
      'Full Name',
      'Email',
      'Company',
      'Phone',
      'Subject',
      'Message',
      'Status',
      'Is Read',
      'Submitted Date',
      'Replied Date'
    ];

    const rows = data.map(item => [
      this.escapeCSV(item.name),
      this.escapeCSV(item.email),
      this.escapeCSV(item.company),
      this.escapeCSV(item.phoneNumber || ''),
      this.escapeCSV(item.subject),
      this.escapeCSV(item.message),
      this.escapeCSV(item.status),
      item.isRead ? 'True' : 'False',
      this.escapeCSV(item.date),
      this.escapeCSV(item.repliedAt || '')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    // Add Byte Order Mark (BOM) to support Excel double-byte UTF-8 encoding correctly
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private escapeCSV(value: string): string {
    if (value === null || value === undefined) return '';
    let val = String(value);
    // Double quotes double up, wrap in double quotes if it has double quotes, commas, or newlines
    if (val.includes('"') || val.includes(',') || val.includes('\n') || val.includes('\r')) {
      val = val.replace(/"/g, '""');
      return `"${val}"`;
    }
    return val;
  }
}

class XLSXExporter implements Exporter {
  exportData(data: ContactSubmission[], filename: string): void {
    // Future expansion placeholder for Excel XLSX export
    console.warn('XLSX export format is not implemented yet.', data, filename);
    throw new Error('XLSX export format is not implemented yet. Excel exports will be available in future releases.');
  }
}

export const contactExportService = {
  /**
   * Exports the given contact submissions into the requested format (defaulting to CSV).
   */
  exportContacts(data: ContactSubmission[], format: 'csv' | 'xlsx' = 'csv'): void {
    if (!data || data.length === 0) {
      throw new Error('No contacts available to export.');
    }

    // Auto-generate filename: contacts_YYYY-MM-DD.csv
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const filename = `contacts_${dateStr}.${format}`;

    let exporter: Exporter;
    if (format === 'csv') {
      exporter = new CSVExporter();
    } else if (format === 'xlsx') {
      exporter = new XLSXExporter();
    } else {
      throw new Error(`Unsupported export format: ${format}`);
    }

    exporter.exportData(data, filename);
  }
};

export default contactExportService;
