#!/bin/bash

# Pre-commit hook for code quality checks
# Runs ESLint, Prettier, and security checks on staged files
# Exit with error if any check fails

set -e

RESET='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'

echo -e "${YELLOW}🔍 Running pre-commit checks...${RESET}"

# Get staged files
STAGED_JS_TS=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts)$' || true)
STAGED_ALL=$(git diff --cached --name-only --diff-filter=ACM || true)

if [ -z "$STAGED_JS_TS" ] && [ -z "$STAGED_ALL" ]; then
  echo -e "${YELLOW}ℹ️  No staged files to check${RESET}"
  exit 0
fi

# Check 1: ESLint
if [ -n "$STAGED_JS_TS" ]; then
  echo -e "${YELLOW}▶ Running ESLint...${RESET}"
  if npm run lint -- --max-warnings=0 $STAGED_JS_TS 2>/dev/null; then
    echo -e "${GREEN}✓ ESLint passed${RESET}"
  else
    echo -e "${RED}✗ ESLint failed. Run 'npm run lint -- --fix' to auto-fix issues${RESET}"
    exit 1
  fi
else
  echo -e "${YELLOW}ℹ️  No .js/.ts files to lint${RESET}"
fi

# Check 2: Prettier format check
if [ -n "$STAGED_ALL" ]; then
  echo -e "${YELLOW}▶ Checking Prettier formatting...${RESET}"
  if npx prettier --check $STAGED_ALL 2>/dev/null; then
    echo -e "${GREEN}✓ Prettier check passed${RESET}"
  else
    echo -e "${RED}✗ Prettier formatting issues found. Run 'npx prettier --write .' to auto-fix${RESET}"
    exit 1
  fi
fi

# Check 3: No console.log statements
if [ -n "$STAGED_JS_TS" ]; then
  echo -e "${YELLOW}▶ Checking for console.log statements...${RESET}"
  if grep -l "console\.log\|console\.error\|console\.warn\|debugger" $STAGED_JS_TS 2>/dev/null | grep -v "node_modules"; then
    echo -e "${RED}✗ Found console.log/debugger statements${RESET}"
    exit 1
  else
    echo -e "${GREEN}✓ No console.log statements found${RESET}"
  fi
fi

# Check 4: No hardcoded API keys/secrets
if [ -n "$STAGED_ALL" ]; then
  echo -e "${YELLOW}▶ Checking for hardcoded secrets...${RESET}"
  SECRETS_FOUND=0

  # Check for common patterns
  if grep -rE "(api[_-]?key|secret|password|token|authorization)\s*[:=]\s*['\"].*['\"]" $STAGED_ALL 2>/dev/null | grep -v "node_modules" | grep -v ".env.example"; then
    echo -e "${RED}✗ Possible hardcoded secrets detected${RESET}"
    SECRETS_FOUND=1
  fi

  # Check for AWS key patterns
  if grep -rE "AKIA[0-9A-Z]{16}" $STAGED_ALL 2>/dev/null | grep -v "node_modules"; then
    echo -e "${RED}✗ Possible AWS access key detected${RESET}"
    SECRETS_FOUND=1
  fi

  if [ $SECRETS_FOUND -eq 1 ]; then
    echo -e "${RED}✗ Security check failed: hardcoded secrets found${RESET}"
    exit 1
  else
    echo -e "${GREEN}✓ No hardcoded secrets detected${RESET}"
  fi
fi

# Check 5: .env file not being committed
if echo "$STAGED_ALL" | grep -E "^\.env($|\.)" | grep -v ".env.example"; then
  echo -e "${RED}✗ Attempting to commit .env file${RESET}"
  exit 1
else
  echo -e "${GREEN}✓ No .env files staged${RESET}"
fi

echo -e "${GREEN}✅ All pre-commit checks passed!${RESET}"
exit 0
