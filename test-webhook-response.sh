#!/bin/bash

# Test the webhook endpoint and show response handling
# This simulates what Jira would send and receive

WEBHOOK_URL="http://localhost:3000/api/jira-webhook"
# For deployed version: https://your-domain.vercel.app/api/jira-webhook

echo "🔗 Testing webhook with response handling..."
echo "Endpoint: $WEBHOOK_URL"
echo ""

# Simulate Jira webhook payload
PAYLOAD='{
  "webhookEvent": "jira:issue_updated",
  "issue": {
    "key": "TEST-123",
    "fields": {
      "summary": "Add webhook integration between Jira and GitHub",
      "status": {
        "name": "In Progress"
      }
    }
  }
}'

echo "📤 Sending webhook payload..."
echo "Payload: $PAYLOAD"
echo ""

# Send webhook and capture response
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  "$WEBHOOK_URL" \
  -w "\n--- HTTP_CODE: %{http_code} ---\n")

echo "📥 Webhook Response:"
echo "$RESPONSE"
echo ""

# Parse the response (in a real Jira automation, you could use this data)
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d':' -f2 | tr -d ' -')
RESPONSE_BODY=$(echo "$RESPONSE" | sed '/--- HTTP_CODE:/d')

echo "🔍 Response Analysis:"
echo "HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Webhook processed successfully"
    
    # Extract key information from response
    SUCCESS=$(echo "$RESPONSE_BODY" | jq -r '.success // false')
    ACTION=$(echo "$RESPONSE_BODY" | jq -r '.action // "unknown"')
    MESSAGE=$(echo "$RESPONSE_BODY" | jq -r '.message // "No message"')
    
    echo "Success: $SUCCESS"
    echo "Action: $ACTION"
    echo "Message: $MESSAGE"
    
    # Show processing stats if available
    if [ "$SUCCESS" = "true" ]; then
        PRS_FOUND=$(echo "$RESPONSE_BODY" | jq -r '.stats.matching_prs_found // 0')
        COMMENTS_ADDED=$(echo "$RESPONSE_BODY" | jq -r '.stats.comments_successful // 0')
        
        echo "PRs Found: $PRS_FOUND"
        echo "Comments Added: $COMMENTS_ADDED"
    fi
else
    echo "❌ Webhook failed with HTTP $HTTP_CODE"
    ERROR=$(echo "$RESPONSE_BODY" | jq -r '.error // "Unknown error"')
    echo "Error: $ERROR"
fi

echo ""
echo "📝 In Jira Automation Rules, you can:"
echo "1. Check if webhookResponse.body.success == true"
echo "2. Use webhookResponse.body.message for logging"
echo "3. Retry if webhookResponse.body.success == false"
echo "4. Get stats from webhookResponse.body.stats"