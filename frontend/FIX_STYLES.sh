#!/bin/bash

# Fix Tailwind CSS Configuration
echo "🔧 Fixing Tailwind CSS configuration..."

cd "$(dirname "$0")"

# Uninstall Tailwind v4
echo "Uninstalling Tailwind CSS v4..."
npm uninstall tailwindcss

# Install Tailwind CSS v3 (stable version)
echo "Installing Tailwind CSS v3..."
npm install -D tailwindcss@^3.4.0 postcss@^8.4.0 autoprefixer@^10.4.0

echo "✅ Tailwind CSS v3 installed!"
echo ""
echo "Now restart your dev server:"
echo "  npm run dev"
echo ""
echo "You should now see all the beautiful colors and styling! 🎨"



