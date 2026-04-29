#!/bin/bash

# Test GitHub token permissions
# Usage: ./test-github-token.sh YOUR_GITHUB_TOKEN

TOKEN=$1

if [ -z "$TOKEN" ]; then
    echo "Usage: $0 YOUR_GITHUB_TOKEN"
    exit 1
fi

echo "Testing GitHub token permissions..."

# Test 1: Basic API access
echo "1. Testing basic API access..."
RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN" \
    "https://api.github.com/repos/nisadn/test-github-pages")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Basic API access: SUCCESS"
else
    echo "❌ Basic API access: FAILED (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
    exit 1
fi

# Test 2: List PRs
echo "2. Testing PR list access..."
RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN" \
    "https://api.github.com/repos/nisadn/test-github-pages/pulls")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ PR list access: SUCCESS"
else
    echo "❌ PR list access: FAILED (HTTP $HTTP_CODE)"
fi

# Test 3: Test comment creation (if there's an open PR)
echo "3. Testing comment creation..."
PR_NUMBER=$(curl -s -H "Authorization: Bearer $TOKEN" \
    "https://api.github.com/repos/nisadn/test-github-pages/pulls?state=open" | \
    jq -r '.[0].number // empty')

if [ ! -z "$PR_NUMBER" ] && [ "$PR_NUMBER" != "null" ]; then
    echo "Found open PR #$PR_NUMBER, testing comment creation..."
    
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        "https://api.github.com/repos/nisadn/test-github-pages/issues/$PR_NUMBER/comments" \
        -d '{"body":"🧪 **Test Comment** - Testing GitHub API integration from Jira\n\n_This is an automated test comment._"}')
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    
    if [ "$HTTP_CODE" = "201" ]; then
        echo "✅ Comment creation: SUCCESS"
        echo "Test comment added to PR #$PR_NUMBER"
    else
        echo "❌ Comment creation: FAILED (HTTP $HTTP_CODE)"
        echo "Response: $(echo "$RESPONSE" | head -n -1)"
    fi
else
    echo "⚠️  No open PRs found to test comment creation"
fi

echo ""
echo "Token test complete!"