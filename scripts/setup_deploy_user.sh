#!/usr/bin/env bash
set -euo pipefail

# Usage: sudo ./setup_deploy_user.sh <deploy_user> <deploy_path> [ssh_public_key]
# Example: sudo ./setup_deploy_user.sh deploy /home/deploy/randomm-ahhh "ssh-rsa AAA..."

DEPLOY_USER=${1:-deploy}
DEPLOY_PATH=${2:-/home/$DEPLOY_USER/randomm-ahhh}
SSH_PUBKEY=${3:-}

echo "Setting up deploy user '$DEPLOY_USER' and path '$DEPLOY_PATH'"

# Create user if it doesn't exist
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  echo "User $DEPLOY_USER does not exist — creating..."
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
else
  echo "User $DEPLOY_USER already exists"
fi

# Create deploy directory and give ownership to deploy user
mkdir -p "$DEPLOY_PATH"
chown -R "$DEPLOY_USER":"$DEPLOY_USER" "$DEPLOY_PATH"
chmod 755 "$DEPLOY_PATH"

echo "Deploy path created and permissions set:"
ls -ld "$DEPLOY_PATH"

# Optionally install the provided SSH public key for the deploy user
if [ -n "$SSH_PUBKEY" ]; then
  echo "Adding provided SSH public key to $DEPLOY_USER's authorized_keys"
  SSH_DIR="/home/$DEPLOY_USER/.ssh"
  mkdir -p "$SSH_DIR"
  echo "$SSH_PUBKEY" > "$SSH_DIR/authorized_keys"
  chown -R "$DEPLOY_USER":"$DEPLOY_USER" "$SSH_DIR"
  chmod 700 "$SSH_DIR"
  chmod 600 "$SSH_DIR/authorized_keys"
fi

# Install Node.js 18.x and PM2 if apt is available (Debian/Ubuntu)
if command -v apt-get >/dev/null 2>&1; then
  echo "Detected apt-get. Installing Node.js 18.x and PM2 (if missing)..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt-get update -y
  apt-get install -y nodejs build-essential || true
  if ! command -v pm2 >/dev/null 2>&1; then
    npm install -g pm2
  else
    echo "pm2 already installed"
  fi
else
  echo "apt-get not found — skipping automated Node/PM2 install. Please install Node 18+ and PM2 manually."
fi

echo "Setup complete. Ensure your GitHub Actions secret DEPLOY_PATH matches: $DEPLOY_PATH"
