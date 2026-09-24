// scratch/prepare_approved_assets.js
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';

const userUploadedDir = 'C:/Users/VangapanduAshokNagaV/.gemini/antigravity-ide/brain/20079422-4852-4990-977f-d18eb5f5a675/.user_uploaded';
const srcIllustration = path.join(userUploadedDir, 'media_1789989258335.png');

const publicDir = path.resolve('public/email-assets');
const distDir = path.resolve('dist/email-assets');
const assetsImagesDir = path.resolve('assets/images');

fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(assetsImagesDir, { recursive: true });

// 1. Copy the 3D illustration
fs.copyFileSync(srcIllustration, path.join(publicDir, 'testimonial-approved.png'));
fs.copyFileSync(srcIllustration, path.join(assetsImagesDir, 'testimonial-approved.png'));
fs.copyFileSync(srcIllustration, path.join(distDir, 'testimonial-approved.png'));
console.log('✓ Copied testimonial-approved.png');

// 2. Generate eye view icon
const eyeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#6C3CFF" fill-opacity="0.2" stroke="#8F85FF" stroke-opacity="0.4" stroke-width="2"/>
  <circle cx="32" cy="32" r="21" fill="#432888" fill-opacity="0.5"/>
  <path d="M19 32C22.5 24 27 20 32 20C37 20 41.5 24 45 32C41.5 40 37 44 32 44C27 44 22.5 40 19 32Z" fill="none" stroke="#C084FC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="32" cy="32" r="5" fill="#FFFFFF"/>
</svg>`;

const eyeSvgPath = path.join(publicDir, 'email-icon-view.svg');
fs.writeFileSync(eyeSvgPath, eyeSvg, 'utf-8');

const eyePngPublic = path.join(publicDir, 'email-icon-view.png');
execSync(`npx -y sharp-cli -i "${eyeSvgPath}" -o "${eyePngPublic}" resize 64`);
fs.copyFileSync(eyePngPublic, path.join(assetsImagesDir, 'email-icon-view.png'));
fs.copyFileSync(eyePngPublic, path.join(distDir, 'email-icon-view.png'));
console.log('✓ Generated and copied email-icon-view.png');

// 3. Upload to Supabase Storage 'email-assets' bucket
const supabaseUrl = 'https://xpuhbtsgwhgbcvmwzlyd.supabase.co';
const supabaseAnonKey = 'sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const uploadFiles = [
  'testimonial-approved.png',
  'email-icon-view.png'
];

async function uploadToStorage() {
  for (const fileName of uploadFiles) {
    const filePath = path.join(publicDir, fileName);
    const fileBuffer = fs.readFileSync(filePath);
    const { data, error } = await supabase.storage
      .from('email-assets')
      .upload(fileName, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });
    if (error) {
      console.error(`✗ Failed to upload ${fileName}:`, error.message);
    } else {
      console.log(`✓ Uploaded ${fileName} to Supabase storage CDN`);
    }
  }
}

uploadToStorage();
