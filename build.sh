#!/bin/bash

# Install Python
apt-get update
apt-get install -y python3 python3-pip

# Install required Python packages
pip3 install requests beautifulsoup4

# Run your Next.js build
npm run build

