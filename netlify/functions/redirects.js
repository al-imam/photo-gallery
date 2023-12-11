// netlify/functions/redirects.js

exports.handler = async (event, context) => {
  const redirectTo = `https://cdn.discordapp.com/attachments/${
    process.env.DISCORD_CHANNEL
  }/${event.path.replace('/media-storage-index/', '')}`

  return {
    statusCode: 200,
    headers: {
      Location: redirectTo,
    },
    body: null,
  }
}
