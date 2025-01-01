//importok
require('dotenv').config();
const {Client, IntentsBitField, ChannelType, EmbedBuilder} = require('discord.js');
const client = new Client({intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildVoiceStates]});
//bot login
client.login(process.env.TOKEN);
//lista a szobáknak
let officeChannels = [];
let officeChannelNames = ["kecója", "kockája", "irodája", "tere", "szobája", "beszélgetője"];
client.on('ready', () => {  

    //log, ha elindult a bot
    console.log(`Logged in as ${client.user.tag}!`);

    //guild lekérése
    const guild = client.guilds.cache.get(process.env.GUILD_ID);  

    //ha valaki hangcsatornát vált
    client.on("voiceStateUpdate", (oldState, newState) => {
        if (newState.channel == null) {return;} //ha valaki kilép a hangcsatornából ne hozzo létre újat
            if (newState.channel.id == process.env.CHANNEL_ID) {
               console.log(newState.channel.name, newState.channel.id);

               //csatorna létrehozása
                guild.channels.create({
                   name: `${newState.member.displayName} ${officeChannelNames[Math.floor(Math.random() * officeChannelNames.length)]}`,
                   type: ChannelType.GuildVoice
                   
                }).then(channel => {

                    //új csatora logolása, jogosultságok beállítása, DM küldése
                    console.log(`Created new voice channel: ${channel.name}`);
                    const permissionOverwrites = [
                        {
                            id: newState.member.id,
                            allow: ["0x0000000001000000"],
                        },
                        {
                            id: guild.roles.everyone.id,
                            deny: ["0x0000000001000000"],
                        },
                    ];
                    //member áthelyezése az új csatornába
                    channel.permissionOverwrites.set(permissionOverwrites)
                        .then(updatedChannel => console.log(`Updated permissions for channel: ${updatedChannel.name}`))
                        .catch(console.error);
                        
                    setTimeout(() => {
                        const officeChannel = guild.channels.cache.find(channel => 
                            officeChannelNames.some(name => channel.name.includes(name))
                        );
                        newState.member.voice.setChannel(officeChannel);
                        officeChannels.push(officeChannel.id);
                        newState.member.createDM().then(dmChannel => {
                        const newembed = new EmbedBuilder()
                           .setAuthor({name: `${client.user.displayName}`, iconUrl: `${client.user.avatarURL}`})
                           .setTitle('Új iroda a neved alatt')
                                .setDescription(`Üdvözlünk az új irodádban, ${newState.member.displayName}! \n Meghívhatsz másokat: \n\n -ezzel a linkkel ${channel}, \n\n -vagy áthúzhatsz másokat a csatornádba!`)
                            .setColor('Red')
                            .addFields(
                                {name: 'Csatorna:', value:  `${channel.name}`, inline: true},   
                                {name: 'Készítés ideje:', value: `${channel.createdAt}`, inline: true}
                            )
                            .setFooter({text: 'A botot készítette DDani6', iconUrl: `${client.user.avatarURL}`})
                        dmChannel.send({embeds: [newembed]});
                        }).catch(console.error);
                    }, 500);
                }).catch(console.error);

                
                
                
                
            };
            //ha valaki kilép a csatornából, és az üres, törölje
            if (oldState.channelID in officeChannels) {
                    if (oldState.channel.members.size == 0) {
                        guild.channels.cache.get(oldState.channel.id).delete();
                        officeChannels = officeChannels.filter(channel => channel !== oldState.channel.id);
                        console.log(officeChannels);
                    };
                };
    });
    client.on('voiceStateUpdate', (oldState, newState) => {
        if (oldState.channel == null) {return;}
        console.log(oldState.channel.members.size);  
        if (officeChannelNames.some(name => oldState.channel.name.includes(name))) {
            
            console.log(`${oldState.member.displayName} has left the channel ${oldState.channel.name}`);
            if (oldState.channel.members.size == 0) {
                guild.channels.cache.get(oldState.channel.id).delete();
                officeChannels = officeChannels.filter(channel => channel !== oldState.channel.id);
        }}; 
    });
    
});
