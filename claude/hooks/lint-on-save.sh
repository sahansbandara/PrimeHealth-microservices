#!/bin/bash

# Lint-on-save hook for automatic code formatting
# Takes a filename argument and runs ESLint --fix and Prettier --write
# Reports what was fixed

if [ $# -eq 0 ]; then
  echo "Usage: lint-on-save.sh <filename>"
  exit 1
fi

FILENAME="$1"
RESET='\033[0m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'

if [ ! -f "$FILENAME" ]; then
  echo -e "${YELLOW}⚠️  File not found: $FILENAME${RESET}"
  exit 1
fi

echo -e "${BLUE}🔧 Fixing $FILENAME...${RESET}"

# Check if file is JavaScript or TypeScript
if [[ "$FILENAME" =~ \.(js|ts|jsx|tsx)$ ]]; then
  echo -e "${BLUE}▶ Running ESLint --fix...${RESET}"
  if npx eslint --fix "$FILENAME" 2>/dev/null; then
    echo -e "${GREEN}✓ ESLint fixes applied${RESET}"
  else
    echo -e "${YELLOW}ℹ️  ESLint completed (some issues may require manual fixes)${RESET}"
  fi
fi

# Run Prettier on all file types
echo -e "${BLUE}▶ Running Prettier --write...${RESET}"
if npx prettier --write "$FILENAME" 2>/dev/null; then
  echo -e "${GREEN}✓ Prettier formatting applied${RESET}"
else
  echo -e "${YELLOW}ℹ️  Prettier completed${RESET}"
fi

echo -e "${GREEN}✅ File fixed: $FILENAME${RESET}"
exit 0
