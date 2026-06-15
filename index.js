require('dotenv').config();
const { Client, GatewayIntentBits, Partials, ActivityType, Events } = require('discord.js');
const { ensureFonts } = require('./utils/fonts');
const rouletteGame = require('./games/roulette');
const hideAndSeekGame = require('./games/hideAndSeek');
const flagsGame = require('./games/flags');
const fastGame = require('./games/fast');
const colorsGame = require('./games/colors');
const mathGame = require('./games/math');
const katGame = require('./games/kat');
const xoGame = require('./games/xo');
const fakkakGame = require('./games/fakkak');
const riddleGame = require('./games/riddle');
const rakkebGame = require('./games/rakkeb');
const boxGame = require('./games/box');
const loGame = require('./games/lo');
const jamGame = require('./games/jam');
const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

 ensureFonts();

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  const content = message.content.trim();
  if (content !== '+العاب') return;

  const lines = [
    '+روليت',
    '+غميضة',
    '+اعلام',
    '+اسرع',
    '+الوان',
    '+حساب',
    '+كت',
    '+اكس',
    '+فكك',
    '+لغز',
    '+ركب',
    '+صندوق',
    '+لو',
    '+جمع'
  ];

  await message.channel.send(lines.join('\n'));
});

rouletteGame.register(client);
hideAndSeekGame.register(client);
flagsGame.register(client);
fastGame.register(client);
colorsGame.register(client);
mathGame.register(client);
katGame.register(client);
xoGame.register(client);
fakkakGame.register(client);
riddleGame.register(client);
rakkebGame.register(client);
boxGame.register(client);
loGame.register(client);
jamGame.register(client);

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);

  if (config.streaming && config.streaming.enabled) {
    client.user.setPresence({
      activities: [
        {
          name: config.streaming.name || 'HOOK',
          type: ActivityType.Streaming,
          url: config.streaming.url || 'https://twitch.tv/'
        }
      ],
      status: 'online'
    });
  }
});

const token = config.token || process.env.DISCORD_TOKEN;
if (!token) {
  console.error('No bot token provided. ضع التوكن في config.json أو في متغير البيئة DISCORD_TOKEN');
  process.exit(1);
}

client.login(token);
