const {Intents, Client, Collection, MessageEmbed} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });
const fs = require('fs')

const dotenv = require('dotenv');

dotenv.config();

client.commands = new Collection();
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

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    let prefix = process.env.PREFIX;

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

        const embed = new MessageEmbed({
            title: `${command.name}にてエラー発生`,
            color: 0xf04747,
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
        })

        const log_channel = await client.channels.fetch(process.env.LOG_CHANNEL);
        console.log(log_channel)
        if (log_channel) await log_channel.send({embeds: [embed]});
        const error_embed = new MessageEmbed({color: 0xf04747, title: '予期しない例外が発生しました'})
        await message.channel.send({embeds: [error_embed]});
    }

});

client.login(process.env.TOKEN);