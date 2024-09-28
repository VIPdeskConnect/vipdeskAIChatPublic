# VIPdesk AI Chat Code

In order to implement VIPdesk AI Chat, you will need to do 2 things

1. Download the **chatScript.js** and save it to your site directory
2. Review the code from **site.html** and add both script tags to your site.
   - Be sure to customize the **chatEnabledHosts** with the one provided
   - Be sure to customize the **chatEnabledHosts** with any domain you wish chat to be visible. You may omit this if chat is to appear accross all domains that host the code.
   - Be sure to change the reference location **chatScript.js** to match where you stored the **chatScript.js** file.

# Testing

Once implemented, chat should load as soon as the page is ready. Sessions and opened chat state should persist when navigating
If using **chatEnabledHosts**, chat will only appear on other domains if:

- Chat code is hosted and
- The domain is included in **chatEnabledHosts** or chat has been previously opened.

# Deployment to Production

When deploying to production, be sure to update the **chatEnabledHosts** with the production bot. Failure to do so will result in the bot appearing to work, but chats will not route to agents and you will lose reporting data.
