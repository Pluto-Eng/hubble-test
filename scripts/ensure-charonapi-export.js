const fs = require('fs');
const path = require('path');

// Manage CharonAPI export in index.ts
const indexPath = path.join(__dirname, '..', 'src', 'lib', 'charon-client', 'generated', 'index.ts');
const charonApiExportString = "export { CharonAPI } from '../CharonAPI';";

try {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  if (!indexContent.includes(charonApiExportString)) {
    const coreExportEnd = indexContent.indexOf("export type { OpenAPIConfig } from './core/OpenAPI';");
    if (coreExportEnd !== -1) {
      const insertionPoint = indexContent.indexOf('\n', coreExportEnd) + 1;
      indexContent = indexContent.slice(0, insertionPoint) + `\n${charonApiExportString}\n` + indexContent.slice(insertionPoint);
      fs.writeFileSync(indexPath, indexContent, 'utf8');
      console.log('Added CharonAPI export to generated index.ts');
    } else {
      console.warn('Could not find core OpenAPIConfig export in index.ts to anchor CharonAPI export. CharonAPI export not added.');
    }
  } else {
    console.log('CharonAPI export already present in generated index.ts');
  }
} catch (error) {
  console.error('Error processing index.ts for CharonAPI export:', error);
}

// --- Manage core files ---
const coreFilesToEnsure = [
  'FetchHttpRequest.ts',
  'AbortError.ts',
  'BaseHttpRequest.ts'
];

coreFilesToEnsure.forEach(fileName => {
  const targetPath = path.join(__dirname, '..', 'src', 'lib', 'charon-client', 'generated', 'core', fileName);
  const templatePath = path.join(__dirname, fileName.replace('.ts', '.template.ts'));

  try {
    if (!fs.existsSync(targetPath)) {
      if (fs.existsSync(templatePath)) {
        fs.copyFileSync(templatePath, targetPath);
        console.log(`Copied ${path.basename(templatePath)} to generated core directory.`);
      } else {
        console.error(`Error: ${path.basename(templatePath)} not found in scripts directory. Cannot copy.`);
      }
    } else {
      console.log(`${fileName} already present in generated core directory.`);
    }
  } catch (error) {
    console.error(`Error managing ${fileName}:`, error);
  }
}); 