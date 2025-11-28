const fs = require('fs');
const path = require('path');

function updateImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      updateImports(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      const original = content;
      
      // Replace relative imports with @/ imports
      content = content.replace(/from ['"]\.\.\/components\//g, "from '@/components/");
      content = content.replace(/from ['"]\.\.\/lib\//g, "from '@/lib/");
      content = content.replace(/from ['"]\.\.\/types['"]/g, "from '@/types'");
      content = content.replace(/from ['"]\.\.\/contexts\//g, "from '@/contexts/");
      content = content.replace(/from ['"]\.\.\/hooks\//g, "from '@/hooks/");
      content = content.replace(/from ['"]\.\.\/services\//g, "from '@/services/");
      content = content.replace(/from ['"]\.\.\/\.\.\/components\//g, "from '@/components/");
      content = content.replace(/from ['"]\.\.\/\.\.\/lib\//g, "from '@/lib/");
      content = content.replace(/from ['"]\.\.\/\.\.\/types['"]/g, "from '@/types'");
      content = content.replace(/from ['"]\.\.\/\.\.\/contexts\//g, "from '@/contexts/");
      content = content.replace(/from ['"]\.\.\/\.\.\/hooks\//g, "from '@/hooks/");
      content = content.replace(/from ['"]\.\.\/\.\.\/services\//g, "from '@/services/");
      
      if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Updated:', filePath);
      }
    }
  }
}

updateImports('./src');
console.log('Done!');

