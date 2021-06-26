const fs = require('fs');
const schedule = require('node-schedule');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();


const { FIDER_URL, WEBHOOK_URL, THUMBNAIL_URL, UPDATE_INTERVAL } = process.env;
const updateInterval = UPDATE_INTERVAL || 15;

const jobs = [
  schedule.scheduleJob(`*/${updateInterval} * * * *`, async function(){
    const FIDER_CACHE_FILE = 'fider-cache.json';

    console.log('Fetching Fider posts');
    const posts = (await axios.get(`${FIDER_URL}/api/v1/posts?limit=3`)).data;
    const cachedPosts = fs.existsSync(FIDER_CACHE_FILE) ? JSON.parse(fs.readFileSync(FIDER_CACHE_FILE)) : [];
    fs.writeFileSync(FIDER_CACHE_FILE, JSON.stringify(posts, undefined, 2));

    const newPosts = posts
      .filter(p => !cachedPosts.map(cp => cp.id).includes(p.id))
      .filter(p => p.status === 'open');

    for(const { id, title, slug, description, createdAt, user } of newPosts) {
      console.log(`Posting ${id}: ${title}`)
      await axios.post(WEBHOOK_URL, {
        embeds: [{
          title,
          description,
          url: `${FIDER_URL}/${slug}`,
          footer: {
            text: `Submitted by ${user.name}`,
          },
          author: {
            name: 'New Suggestion',
            url: FIDER_URL
          },
          timestamp: createdAt,
          thumbnail: {
            url: THUMBNAIL_URL || 'https://raw.githubusercontent.com/getfider/fider/main/favicon.png',
          }
        }]
      })
    }

  })
];
