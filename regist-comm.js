const {REST, Routes, Options} = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name : "rename",
        description : "Rename your bot",
        options : [
            {
                name : "new-name",
                description : "Name of your bot",
                type : 3,
                required : true
            },
        ],
    },
];

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID, 
                process.env.GUILD_ID),  
                {body: commands},

        )

    } catch (error) {
        console.error(error);
    }
})();