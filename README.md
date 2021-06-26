# Fider Webhook

## Installation

1. Install [Node.js](https://nodejs.org/).
2. Clone this repo: `git clone https://github.com/FOSSforlife/fider-webhook`
3. Install dependencies: `cd fider-webhook && npm i`

## Usage

First, [create a webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks). Then copy `.env.example` to a file named `.env`, and add the following variables:
- `FIDER_URL`: The URL of your Fider installation, e.g. `https://feedback.fider.io`
- `WEBHOOK_URL`: The URL of the webhook you've created.

Then, run `node index.js`, leave the terminal open, and now every 15 minutes new posts will be posted to the webhook specified.

Alternatively, you can run this in the background using something like [PM2](https://pm2.keymetrics.io).

