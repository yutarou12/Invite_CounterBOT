const {MessageEmbed} = require('discord.js')

module.exports = {
    name: 'mylink',
    hidden: false,
    aliases: [],
    args: [],
    description: ["自分が作成した招待リンクの一覧を表示します"],
    async execute(message) {

        if(!message.guild.me.permissions.has("CREATE_INSTANT_INVITE")
        || !message.guild.me.permissions.has("EMBED_LINKS")
        || !message.guild.me.permissions.has("MANAGE_GUILD")) return await message.channel.send({embed:[{description:"このコマンドの実行には、権限:\n・「招待の作成」\n・「埋め込みリンク」\n・「招待を作成」\nが必要です"}]})
        const invites = await message.guild.invites.fetch()
        let member_invite_all_list = invites.filter(i => {
            return i.inviter.id === message.author.id
        })
        let member_invite_list = []
        member_invite_all_list.map(i => {
            member_invite_list.push(i.code + ":" + i.uses + " 回")
        })
        const msg_embed = new MessageEmbed({
            title: message.author.tag + " | 招待リンク一覧",
            description: member_invite_list.join('\n'),
            color: "BLUE"
        })
        message.channel.send({embeds: [msg_embed]})
    }
}