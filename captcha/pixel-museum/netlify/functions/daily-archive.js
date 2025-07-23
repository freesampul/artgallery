// Netlify Scheduled Function to archive daily winner
// Runs at midnight Eastern Time daily
exports.handler = async (event, context) => {
  try {
    // Only run if this is a scheduled event
    if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Calculate yesterday's date (in Eastern Time)
    const now = new Date();
    const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const timezoneOffset = -5; // NYC Eastern timezone (EST)
    const localYesterday = new Date(yesterday.getTime() + (timezoneOffset * 60 * 60 * 1000));
    const yesterdayString = localYesterday.toISOString().split('T')[0];
    
    // Format the competition date nicely
    const competitionDate = localYesterday.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    console.log(`Attempting to archive winner for ${yesterdayString} (${competitionDate})`);

    // Call the archive-winner API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://digitaljunk.art';
    const response = await fetch(`${baseUrl}/api/archive-winner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetDate: yesterdayString,
        competitionDate: competitionDate
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log(`Successfully archived winner: ${result.winner.title} by ${result.winner.author}`);
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Daily winner archived successfully',
          date: yesterdayString,
          winner: result.winner
        })
      };
    } else {
      console.error('Failed to archive winner:', result.error);
      
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: result.error || 'Failed to archive winner',
          date: yesterdayString
        })
      };
    }

  } catch (error) {
    console.error('Error in daily archive function:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error.message
      })
    };
  }
}; 