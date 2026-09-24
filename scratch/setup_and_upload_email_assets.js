// scratch/setup_and_upload_email_assets.js
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const publicEmailAssetsDir = path.resolve('public/email-assets');
const distEmailAssetsDir = path.resolve('dist/email-assets');
const assetsImagesDir = path.resolve('assets/images');

fs.mkdirSync(publicEmailAssetsDir, { recursive: true });
fs.mkdirSync(distEmailAssetsDir, { recursive: true });

// Copy and map all assets to canonical email-assets naming
const assetMappings = [
  { src: 'av-brand-icon.png', dest: 'av-logo.png' },
  { src: 'testimonial-email-illustration.png', dest: 'testimonial-received.png' },
  { src: 'testimonial-approved.png', dest: 'testimonial-approved.png' },
  { src: 'testimonial-approved.png', dest: 'testimonial-approved-card.png' },
  { src: 'email-icon-clock.png', dest: 'email-next-step.png' },
  { src: 'email-icon-check.png', dest: 'email-check.png' },
  { src: 'email-icon-portfolio.png', dest: 'portfolio-icon.png' },
  { src: 'email-icon-linkedin.png', dest: 'linkedin-icon.png' },
  { src: 'email-icon-github.png', dest: 'github-icon.png' },
];

for (const { src, dest } of assetMappings) {
  const srcPath = path.join(assetsImagesDir, src);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(publicEmailAssetsDir, dest));
    fs.copyFileSync(srcPath, path.join(distEmailAssetsDir, dest));
    console.log(`✓ Copied ${src} -> public/email-assets/${dest}`);
  } else {
    console.error(`✗ Missing source file: ${srcPath}`);
  }
}

// Upload to Supabase Storage public bucket
const supabaseUrl = 'https://xpuhbtsgwhgbcvmwzlyd.supabase.co';
const supabaseAnonKey = 'sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadAll() {
  console.log('\nUploading email assets to Supabase Storage bucket "email-assets"...');
  for (const { dest } of assetMappings) {
    const filePath = path.join(publicEmailAssetsDir, dest);
    const fileBuffer = fs.readFileSync(filePath);
    
    const { data, error } = await supabase.storage
      .from('email-assets')
      .upload(dest, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.error(`✗ Failed to upload ${dest}:`, error.message);
    } else {
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/email-assets/${dest}`;
      console.log(`✓ Uploaded ${dest} -> ${publicUrl}`);
    }
  }
}

uploadAll();
