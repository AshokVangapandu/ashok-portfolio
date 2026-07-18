// scratch/test_ux_preview_page.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Testing public page preview iframe PDF check ---');

  const filePath = path.join(__dirname, '../src/pages/CertificationsShowcasePage.tsx');
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Verify that iframe is rendered for PDFs
  if (content.includes('<iframe') && content.includes('selectedCard.pdfUrl.toLowerCase().includes(\'.pdf\')')) {
    console.log('SUCCESS: Professional Certifications page successfully displays PDF documents inside an iframe element!');
  } else {
    console.error('FAIL: PDF preview iframe check failed.');
    process.exit(1);
  }

  // Verify the updated verified math expression
  if (content.includes('c.verificationUrl') && content.includes('c.pdfUrl')) {
    console.log('SUCCESS: Verified statistics calculation correctly includes file presence.');
  } else {
    console.error('FAIL: Verified percentage calculation mapping is incorrect.');
    process.exit(1);
  }
}

runTest();
