require('dotenv').config();
const {Client,IntentsBitField} = require('discord.js');
const client = new Client(
    {
        intents: [
            IntentsBitField.Flags.Guilds
        ]
    }
);
client.login(process.env.TOKEN);
client.on('ready', () => {
    console.log('Bot is ready');
});
