import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import JSZip from 'jszip';

async function bundle() {
  console.log('🚀 Starting production build...');
  
  try {
    // 1. Run the build
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('📦 Bundling dist folder into ZIP...');
    const zip = new JSZip();
    const distPath = path.resolve('dist');
    
    if (!fs.existsSync(distPath)) {
      throw new Error('Build failed: dist folder not found.');
    }

    // Helper to recursively add files
    function addFilesToZip(currentPath, zipFolder) {
      const files = fs.readdirSync(currentPath);
      for (const file of files) {
        const fullPath = path.join(currentPath, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          addFilesToZip(fullPath, zipFolder.folder(file));
        } else {
          zipFolder.file(file, fs.readFileSync(fullPath));
        }
      }
    }

    addFilesToZip(distPath, zip);

    // 2. Generate the ZIP file
    const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    const zipName = 'lesson-planner-static.zip';
    fs.writeFileSync(zipName, content);

    console.log(`\n✅ Success! Your static site is bundled in: ${zipName}`);
    console.log('You can download it from the file explorer on the left.');
  } catch (error) {
    console.error('❌ Bundling failed:', error.message);
    process.exit(1);
  }
}

bundle();
