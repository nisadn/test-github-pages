// Example webhook endpoint that returns responses to Jira
// This could be deployed as a Vercel/Netlify function or Express server

export default async function handler(req, res) {
  // Only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported'
    });
  }

  try {
    // Extract Jira data from webhook
    const { issue } = req.body;
    const jiraKey = issue?.key;
    const jiraStatus = issue?.fields?.status?.name;
    const jiraSummary = issue?.fields?.summary;
    
    if (!jiraKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing Jira issue key',
        message: 'Jira key is required to process the webhook'
      });
    }

    console.log `Processing Jira webhook for: ${jiraKey}`;

    // Search for GitHub PRs
    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = 'nisadn';
    const repoName = 'test-github-pages';
    
    const searchResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/pulls?state=open`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github+json'
        }
      }
    );

    if (!searchResponse.ok) {
      return res.status(500).json({
        success: false,
        error: 'GitHub API error',
        message: `Failed to search PRs: ${searchResponse.status}`
      });
    }

    const prs = await searchResponse.json();
    
    // Find PRs matching Jira key
    const matchingPRs = prs.filter(pr => 
      pr.title.includes(jiraKey) || 
      pr.body?.includes(jiraKey) || 
      pr.head.ref.includes(jiraKey)
    );

    if (matchingPRs.length === 0) {
      return res.status(200).json({
        success: true,
        action: 'no_action',
        message: `No PRs found for Jira issue: ${jiraKey}`,
        jira_key: jiraKey,
        prs_searched: prs.length
      });
    }

    // Add comments to matching PRs
    const results = [];
    
    for (const pr of matchingPRs) {
      const comment = `🎫 **Jira Update**: [${jiraKey}](${issue.self})
      
**Status**: \`${jiraStatus}\`
**Summary**: ${jiraSummary}

_Updated automatically from Jira webhook_`;

      const commentResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/issues/${pr.number}/comments`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ body: comment })
        }
      );

      results.push({
        pr_number: pr.number,
        pr_title: pr.title,
        comment_added: commentResponse.ok,
        status_code: commentResponse.status
      });
    }

    // Return success response to Jira
    return res.status(200).json({
      success: true,
      action: 'comments_added',
      message: `Processed ${matchingPRs.length} PRs for Jira issue: ${jiraKey}`,
      jira_key: jiraKey,
      jira_status: jiraStatus,
      processing_results: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}