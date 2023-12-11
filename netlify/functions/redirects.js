// netlify/functions/redirects.js

exports.handler = async (event, context) => {
  const { splat } = event.params
  const discordChannel = process.env.DISCORD_CHANNEL

  if (!discordChannel) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'DISCORD_CHANNEL environment variable is not set',
      }),
    }
  }

  const redirectTo = `https://cdn.discordapp.com/attachments/${discordChannel}/${splat}`

  return {
    statusCode: 200,
    body: JSON.stringify({ redirectTo }),
  }
}
