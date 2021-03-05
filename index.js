const Discord = require('discord.js');
const client = new Discord.Client({ws : { intents: Discord.Intents.ALL } });
const fs = require('fs'),
    config = require('./config.json')

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', async () => {
    client.user.setActivity(`@${client.user.username} help`, { type: 'PLAYING' })

    global.helps = client.commands.filter( command => !command.hidden ).map( command => {
        if (command.hidden) return;
        return {
            name: command.name,
            aliases: command.aliases,
            args: command.args,
            description: command.description
        }
    });

    console.log(`${client.user.username} | ${client.user.id}`);
    console.log(`Server Count : ${client.guilds.cache.size}`)
    console.log(`Discord Login`);
});

client.on('message', async message => {
    if (message.author.bot) return;

    let prefix = config.PREFIX;

    const mention_match = message.content.match(/^<@(!|&|)(\d{17,})>/);
    if (mention_match) {
        if (client.user.id === mention_match[2] || message.mentions.roles.some( role => role.id === mention_match[2] && role.members.has(client.user.id) && role.members.size === 1 ) ){
            message.content = message.content.slice(mention_match[0].length);
        } else return;
    } else if (message.content.startsWith(prefix)) {
        message.content = message.content.slice(prefix.length);
    } else return;

    const args = message.content.trim().split(/ +/),
        commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        await command.execute(message, args, prefix);
    } catch (error) {
        console.log(error.stack);

        let icon = client.user.avatarURL({ format: 'png', dynamic: true, size:2048 }),
            channel_name = client.user.username,
            guild_name = 'DM';

        if (message.guild && message.guild.available) {
            icon = message.guild.iconURL({ format: 'png', dynamic: true, size:2048 });
            channel_name = message.channel.name;
            guild_name = message.guild.name;
        }

        const embed = {
            color: 0xf04747,
            title: `${command.name}にてエラー発生`,
            author: {
                name: message.author.tag,
                icon_url: message.author.avatarURL({ format: 'png', dynamic: true, size:2048 }),
                url: message.author.avatarURL({ format: 'png', dynamic: true, size:2048 }),
            },
            description: `${message.content}\n\`\`\`${error.stack}\`\`\``,
            timestamp: new Date(),
            footer: {
                text: `\nG:${guild_name} | C:${channel_name} `,
                icon_url: icon
            },
        };
        console.log(embed);

        const log_channel = client.channels.cache.get(config.LOG_CHANNEL);
        if (log_channel) await log_channel.send({embed:embed});
        await message.channel.send({
            embed:{
                color: 0xf04747,
                title: `予期しない例外が発生しました`,
            }
        });
    }

});

client.login(config.TOKEN);