#!/bin/bash

# Test the repository dispatch approach
# This simulates what Jira automation would send

# You need a personal token ONLY for triggering the dispatch
# The actual commenting is done by GitHub Actions bot
GITHUB_TOKEN=${1:-"your_token_here"}

if [ "$GITHUB_TOKEN" = "your_token_here" ]; then
    echo "Usage: $0 YOUR_GITHUB_TOKEN"
    echo ""
    echo "This token is ONLY used to trigger the workflow."
    echo "The workflow itself uses GitHub Actions bot for commenting."
    exit 1
fi

echo "🚀 Testing repository dispatch (simulating Jira webhook)..."

# Simulate Jira sending webhook to trigger GitHub Actions
curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/repos/nisadn/test-github-pages/dispatches" \
  -d '{
    "event_type": "jira-update",
    "client_payload": {
      "issue": {
        "key": "TEST-123",
        "summary": "Test integration between Jira and GitHub",
        "status": "In Progress",
        "url": "https://your-domain.atlassian.net/browse/TEST-123"
      }
    }
  }'

echo ""
echo "✅ Repository dispatch sent!"
echo ""
echo "📋 What happens next:"
echo "1. GitHub Actions receives the dispatch"
echo "2. Workflow runs using GitHub Actions bot"
echo "3. Bot searches for PRs containing 'TEST-123'"
echo "4. Bot adds comment using GitHub Actions permissions"
echo ""
echo "🔍 Check: go.github.com/nisadn/test-github-pages/actions"