#!/bin/bash

# Test script to simulate Jira webhook
# Usage: ./test-jira-integration.sh JIRA-KEY "Status Name" "Issue Summary"

JIRA_KEY=${1:-"TEST-123"}
JIRA_STATUS=${2:-"In Progress"}
JIRA_SUMMARY=${3:-"Test issue summary"}
JIRA_URL="https://your-domain.atlassian.net/browse/$JIRA_KEY"

echo "Testing Jira integration for: $JIRA_KEY"

# Trigger GitHub repository dispatch event
curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/repos/nisadn/test-github-pages/dispatches" \
  -d "{
    \"event_type\": \"jira-update\",
    \"client_payload\": {
      \"issue\": {
        \"key\": \"$JIRA_KEY\",
        \"summary\": \"$JIRA_SUMMARY\",
        \"status\": \"$JIRA_STATUS\",
        \"url\": \"$JIRA_URL\"
      }
    }
  }"

echo "Webhook sent! Check your repository actions for the triggered workflow."