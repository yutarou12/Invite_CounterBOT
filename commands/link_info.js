const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'link_info',
    hidden: false,
    args: ['<Invite Code>'],
    aliases: ['li'],
    description: ['指定された招待リンクのCodeからその情報を表示します'],
    async execute(message, args) {
        if(!message.guild.me.permissions.has("CREATE_INSTANT_INVITE")
        || !message.guild.me.permissions.has("EMBED_LINKS")
        || !message.guild.me.permissions.has("MANAGE_GUILD")) return await message.channel.send({embed: [{description:"このコマンドの実行には、権限:\n・「招待の作成」\n・「埋め込みリンク」\n・「招待を作成」\nが必要です"}]})

        if(!args[0]) return message.channel.send("招待リンクのCodeを指定してください")
        const FETCH_INVITE = await message.guild.invites.fetch()
        const INVITE_CODE = FETCH_INVITE.find(i => i.code === args[0])
        if(!INVITE_CODE) return message.channel.send("招待リンクが見つかりませんでした")

        const msg_embed = new MessageEmbed({
            author: {
                name: `${args[0]} の情報`,
                icon_url: INVITE_CODE.inviter.avatarURL({format:"png"}),
                url: INVITE_CODE.url
            },
            fields: [
                {
                    name: "作成者", value: INVITE_CODE.inviter.tag
                },
                {
                    name: "作成日時", value: INVITE_CODE.createdAt.toLocaleString()
                },
                {
                    name: "使用回数", value: INVITE_CODE.uses + " / " + (INVITE_CODE.maxUses === 0 ? "∞" : INVITE_CODE.maxUses)
                },
                {
                    name: "有効期限", value: INVITE_CODE.maxAge.toString()
                }
            ]
        })

        await message.channel.send({embeds: [msg_embed]})
    }
}