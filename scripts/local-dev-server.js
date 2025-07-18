const { createServer } = require('https');
const https = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const certDir = path.resolve(__dirname, '..', '.certs');
const keyFile = path.join(certDir, 'key.pem');
const certFile = path.join(certDir, 'cert.pem');

fs.mkdirSync(certDir, { recursive: true });

const certsExist = fs.existsSync(certFile) && fs.existsSync(keyFile);

if (!certsExist) {
  try {
    console.log('🔧 TLS certs not found — generating with mkcert...');

    execSync('mkcert localhost', {
      cwd: certDir,
      stdio: 'inherit',
    });

    fs.renameSync(path.join(certDir, 'localhost-key.pem'), keyFile);
    fs.renameSync(path.join(certDir, 'localhost.pem'), certFile);

    console.log('✅ TLS certificates generated successfully');
    process.exit(1);
  } catch (error) {
    console.log(error.message)
    console.error('❌ Failed to generate TLS certificates using mkcert.');
    console.error('Make sure mkcert is installed and you’ve run --> mkcert -install.');
    process.exit(1);
  }
}

const httpsOptions = {
  key: fs.readFileSync(keyFile),
  cert: fs.readFileSync(certFile),
};

app.prepare().then(() => {
  https.createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);

    // Let Next.js handle everything, including /_next/image and /images
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3000');
  });
}); 