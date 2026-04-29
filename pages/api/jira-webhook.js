// Next.js API route for Jira webhooks
// File: pages/api/jira-webhook.js

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed',
      message: 'Only POST requests are supported'
    });
  }

  try {
    console.log('Received Jira webhook:', JSON.stringify(req.body, null, 2));

    // Extract Jira data
    const { issue, webhookEvent } = req.body;
    
    if (!issue?.key) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payload',
        message: 'Missing issue key in Jira webhook payload'
      });
    }

    const {
      key: jiraKey,
      fields: {
        summary: jiraSummary = 'No summary',
        status: { name: jiraStatus = 'Unknown' } = {}
      } = {}
    } = issue;

    const jiraUrl = `https://your-domain.atlassian.net/browse/${jiraKey}`;

    console.log(`Processing Jira ${webhookEvent || 'update'} for: ${jiraKey}`);

    // GitHub API configuration
    const githubToken = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
    
    if (!githubToken) {
      return res.status(500).json({
        success: false,
        error: 'Configuration error',
        message: 'GitHub token not configured'
      });
    }

    // Search for PRs containing this Jira key
    const repoOwner = 'nisadn';
    const repoName = 'test-github-pages';
    
    const prSearchUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/pulls?state=open`;
    
    const prResponse = await fetch(prSearchUrl, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Jira-GitHub-Integration'
      }
    });

    if (!prResponse.ok) {
      const errorText = await prResponse.text();
      return res.status(500).json({
        success: false,
        error: 'GitHub API error',
        message: `Failed to fetch PRs: ${prResponse.status}`,
        details: errorText
      });
    }

    const allPRs = await prResponse.json();
    
    // Find PRs that match this Jira key
    const matchingPRs = allPRs.filter(pr => {
      const titleMatch = pr.title?.toLowerCase().includes(jiraKey.toLowerCase());
      const bodyMatch = pr.body?.toLowerCase().includes(jiraKey.toLowerCase());
      const branchMatch = pr.head?.ref?.toLowerCase().includes(jiraKey.toLowerCase());
      
      return titleMatch || bodyMatch || branchMatch;
    });

    if (matchingPRs.length === 0) {
      return res.status(200).json({
        success: true,
        action: 'no_prs_found',
        message: `No PRs found containing Jira key: ${jiraKey}`,
        jira_key: jiraKey,
        jira_status: jiraStatus,
        searched_prs: allPRs.length,
        webhook_event: webhookEvent,
        timestamp: new Date().toISOString()
      });
    }

    // Add comments to matching PRs
    const commentResults = [];

    for (const pr of matchingPRs) {
      const commentBody = `🎫 **Jira Update**: [${jiraKey}](${jiraUrl})

**Event**: ${webhookEvent || 'Updated'}
**Status**: \`${jiraStatus}\`  
**Summary**: ${jiraSummary}

_Automatically updated from Jira webhook at ${new Date().toLocaleString()}_`;

      const commentUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/issues/${pr.number}/comments`;
      
      const commentResponse = await fetch(commentUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: commentBody })
      });

      const commentResult = {
        pr_number: pr.number,
        pr_title: pr.title,
        pr_url: pr.html_url,
        comment_added: commentResponse.ok,
        http_status: commentResponse.status
      };

      if (!commentResponse.ok) {
        const errorText = await commentResponse.text();
        commentResult.error = errorText;
      }

      commentResults.push(commentResult);
    }

    // Return comprehensive response to Jira
    const response = {
      success: true,
      action: 'processed',
      message: `Successfully processed ${matchingPRs.length} PR(s) for Jira ${jiraKey}`,
      jira_key: jiraKey,
      jira_status: jiraStatus,
      jira_summary: jiraSummary,
      webhook_event: webhookEvent,
      prs_processed: commentResults,
      stats: {
        total_prs_searched: allPRs.length,
        matching_prs_found: matchingPRs.length,
        comments_attempted: commentResults.length,
        comments_successful: commentResults.filter(r => r.comment_added).length
      },
      timestamp: new Date().toISOString()
    };

    console.log('Webhook processing complete:', response);
    
    return res.status(200).json(response);

  } catch (error) {
    console.error('Webhook error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Processing failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}