#!/bin/bash

# Quick token test - replace YOUR_TOKEN_HERE with your actual token
TOKEN="YOUR_TOKEN_HERE"

echo "Testing GitHub token..."

# Test basic access
curl -H "Authorization: Bearer $TOKEN" \
     -H "Accept: application/vnd.github+json" \
     https://api.github.com/repos/nisadn/test-github-pages

echo -e "\n\nIf you see repository data above, your token works!"
echo "If you see 401/403 errors, check your token permissions."