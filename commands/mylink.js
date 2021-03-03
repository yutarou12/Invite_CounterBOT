const {MessageEmbed} = require('discord.js'),
    config = require("../config.json")

module.exports = {
    name: 'mylink',
    hidden: false,
    aliases: [],
    args: [],
    description: ["自分が作成した招待リンクの一覧を表示します"],
    async execute(message) {

        if(!message.guild.members.cache.get(config.BOT_CLIENT_ID).hasPermission("CREATE_INSTANT_INVITE") 
        || !message.guild.members.cache.get(config.BOT_CLIENT_ID).hasPermission("EMBED_LINKS") 
        || !message.guild.members.cache.get(config.BOT_CLIENT_ID).hasPermission("MANAGE_GUILD")) return message.channel.send({embed:{description:"このコマンドの実行には、権限:\n・「招待の作成」\n・「埋め込みリンク」\n・「招待を作成」\nが必要です"}})
        message.guild.fetchInvites().then((invites) => {
            let member_invite_all_list = invites.filter(i => {
                return i.inviter.id === message.author.id
            })
            let member_invite_list = []
            member_invite_all_list.map(i => {
                member_invite_list.push(i.code + ":" + i.uses + " 回")
            })
            const msg_embed = new MessageEmbed()
            .setAuthor(message.author.tag + " | 招待リンク一覧")
            .setDescription(member_invite_list)
            .setColor("BLUE")
            message.channel.send(msg_embed)
        })
    }
}