// netlify/functions/redirects.js

exports.handler = async (event, context) => {
  console.log(event)
  console.log(context)

  if (!discordChannel) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'DISCORD_CHANNEL environment variable is not set',
      }),
    }
  }

  const redirectTo = `https://cdn.discordapp.com/attachments/${process.env.DISCORD_CHANNEL}/:splat`

  return {
    statusCode: 200,
    body: JSON.stringify({ redirectTo }),
  }
}
