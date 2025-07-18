# Local HTTPS Setup for Development

To ensure a secure and consistent development environment that mirrors production, our application runs over HTTPS locally. This guide will walk you through the one-time setup required to generate a trusted local SSL certificate.

This setup uses `mkcert`, a simple tool for making locally-trusted development certificates.

## Prerequisites

- [Homebrew](https://brew.sh/) (for macOS and Linux)

## Step 1: Install mkcert

First, install `mkcert` using Homebrew.

```bash
brew install mkcert
```

## Step 2: Install the Local Certificate Authority (CA)

Next, add the `mkcert` local CA to your system's trust stores. This makes the certificates you generate trusted by your browsers, preventing security warnings.

```bash
mkcert -install
```

You may be prompted for your system password.

_Note for Firefox users:_ If you see a warning about `certutil`, you will need to run `brew install nss` and then run `mkcert -install` again for the CA to be trusted by Firefox.

## Step 3: Run the Development Server

The project is already configured to use these certificates. Simply start the development server as you normally would:

```bash
npm run dev
```

The server will now be running on `https://localhost:3000`.

## How It Works

- The `mkcert` commands you ran created a `.certs` directory containing a `cert.pem` and `key.pem` file. These files are ignored by Git.
- A custom server script at `scripts/local-dev-server.js` tells Next.js to use these certificate files and run over HTTPS.
- The `npm run dev` command is configured in `package.json` to use this custom script.
- The application's authentication service is now configured to set `secure: true` on cookies, as the development server is running over a secure connection. 