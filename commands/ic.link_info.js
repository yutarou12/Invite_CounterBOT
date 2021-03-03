const { MessageEmbed } = require('discord.js'),
    config = require("../config.json")

module.exports = {
    name: 'link_info',
    hidden: false,
    args: ['<Invite Code>'],
    aliases: ['li'],
    description: ['指定された招待リンクのCodeからその情報を表示します'],
    async execute(message, args) {
        if(!message.guild.members.cache.get(config.BOT_CLIENT_ID).hasPermission("CREATE_INSTANT_INVITE") 
        || !message.guild.members.cache.get(config.BOT_CLIENT_ID).hasPermission("EMBED_LINKS") 
        || !message.guild.members.cache.get(config.BOT_CLIENT_ID).hasPermission("MANAGE_GUILD")) return message.channel.send({embed:{description:"このコマンドの実行には、権限:\n・「招待の作成」\n・「埋め込みリンク」\n・「招待を作成」\nが必要です"}})

        if(!args[0]) return message.channel.send("招待リンクのCodeを指定してください")
        const FETCH_INVITE = await message.guild.fetchInvites()
        const INVITE_CODE = FETCH_INVITE.find(i => i.code === args[0])
        if(!INVITE_CODE) return message.channel.send("招待リンクが見つかりませんでした")

        const msg_embed = new MessageEmbed()
        .setAuthor(`${args[0]} の情報`, INVITE_CODE.inviter.avatarURL({format:"png"}), INVITE_CODE.url)
        .addField("作成者", INVITE_CODE.inviter.tag)
        .addField("作成日時", INVITE_CODE.createdAt.toLocaleString())
        .addField("使用回数", INVITE_CODE.uses + " / " + (INVITE_CODE.maxUses == 0 ? "∞" : INVITE_CODE.maxUses))
        .addField("有効期限", INVITE_CODE.maxAge)

        message.channel.send(msg_embed)
    }
}