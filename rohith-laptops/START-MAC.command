#!/bin/bash
cd "$(dirname "$0")"
command -v node >/dev/null || { echo "Please install Node.js LTS from https://nodejs.org"; open https://nodejs.org; exit 1; }
[ -d node_modules ] || { echo "Installing - first time only..."; npm install; }
[ -d public/products ] || { echo "Downloading real product photos - first time only..."; npm run images; }
(sleep 6; open http://localhost:3000) &
npm run dev
