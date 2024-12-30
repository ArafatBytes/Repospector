#!/bin/bash

# Install dependencies
npm install

# Install Playwright and its dependencies
npx playwright install chromium
npx playwright install-deps chromium

# Build the Next.js application
npm run build 