/*
What this provides:
- Node.js and npm (no global installation needed)
- Keeps your system clean in an isolated environment (packages only active in nix-shell)
- Ensures everyone uses the same Node.js version
- Reproducible dev setup across all machines
For Nix users:
1. Run `nix-shell --command $SHELL` in this project directory (will inherit your custom shell configs like Starship, etc.)
2. This automatically provides Node.js and the tools listed in buildInputs below
3. Run `npm install` then `npm run dev` as normal
4. Type `exit` when finished developing
For non-Nix users:
- If you'd like to install Nix, here are the official docs: https://nixos.org/ | https://nixos.org/download/
- Install with:
      macOS        sh <(curl --proto '=https' --tlsv1.2 -L https://nixos.org/nix/install)
      WSL/Linux    sh <(curl -L https://nixos.org/nix/install) --daemon
*/

{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "bgs-app-dev-env";   # shows in Nix logs for debugging/tracking

  buildInputs = with pkgs; [
    nodejs            # node.js (with npm) for running and building the app
    git               # git support, uses your existing .gitconfig
    gnupg             # enables commit signing if configured
    tree              # cli utility to visualize dir structure
    mkcert            # creates local CA and certs for https development
    python3           # nice to have for scripting
    jq                # cli json processor, used in scripts and debugging
    openssl           # ssl/tls tools, required by mkcert and other tooling
    bashInteractive   # full-featured bash shell with readline support
    unzip             # if needed for .zip files in scripts or tooling
    curl              # cli http client, used for api testing
    docker            # docker containers
    awscli2           # for aws cli
    localstack        # local dev setup localstack cli
  ];

  shellHook = ''
    echo "🚀 Dev environment ready!"
    echo "📦 Node.js version: $(node --version)"
    echo "📦 npm version: $(npm --version)"
    echo ""
    echo "Next steps:"
    echo "  npm install     # install dependencies"
    echo "  npm run dev     # start development server"
  '';
}