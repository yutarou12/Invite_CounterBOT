const discord = require('discord.js'),
    client = new discord.Client(),
    config = require("../config.json")

module.exports = {
    name: 'link',
    hidden: false,
    args: ["[Channel]"],
    aliases: [],
    description: ["招待リンクを作成します\n引数なし : そのチャンネルのリンク\n引数あり : 引数のチャンネルのリンク\nどちらも無期限&回数制限なしのリンクです"],
    async execute(message, args) {
        if(!message.guild.members.cache.get(config.BOT_CLIENT_ID).hasPermission("CREATE_INSTANT_INVITE")) return message.channel.send("このコマンドの実行には、権限:「招待の作成」が必要です")
        if(!message.member.hasPermission("CREATE_INSTANT_INVITE")) return message.channel.send("このコマンドの実行には、権限:「招待の作成」を持っている必要がります")

        const options = {
            maxAge: 0
        }

        if (!args[0]){
            message.channel.createInvite(options)
            .then(invite => {
                message.channel.send("招待リンクを作成しました")
                message.channel.send(`\`${invite.url}\``)
            })
        }
        else if (!isNaN(args[0])) {
            const ID_CHANNEL = message.guild.channels.cache.get(args[0])
            if(!ID_CHANNEL)  return message.channel.send("チャンネルを取得できませんでした")
            if(!ID_CHANNEL.permissionsFor(message.guild.members.cache.get(config.BOT_CLIENT_ID)).has("CREATE_INSTANT_INVITE")) return message.channel.send("Botに、そのチャンネルに招待を作成する権限はありません")
            if(!ID_CHANNEL.permissionsFor(message.member).has("CREATE_INSTANT_INVITE")) return message.channel.send("あなたに、そのチャンネルに招待リンクを作成する権限はありません")
            ID_CHANNEL.createInvite(options)
            .then(invite => {
                message.channel.send("招待リンクを作成しました")
                message.channel.send(`\`${invite.url}\``)
            })
        }
        else if (message.content.match(message.mentions.CHANNELS_PATTERN)) {
            const CHANNEL = message.guild.channels.cache.get(message.mentions.channels.first().id)
            if(!CHANNEL) return message.channel.send("チャンネルを取得できませんでした")
            if(!CHANNEL.permissionsFor(message.guild.members.cache.get(config.BOT_CLIENT_ID)).has("CREATE_INSTANT_INVITE")) return message.channel.send("Botに、そのチャンネルに招待を作成する権限はありません")
            if(!CHANNEL.permissionsFor(message.member).has("CREATE_INSTANT_INVITE")) return message.channel.send("あなたに、そのチャンネルに招待リンクを作成する権限はありません")
            CHANNEL.createInvite(options)
            .then(invite => {
                message.channel.send("招待リンクを作成しました")
                message.channel.send(`\`${invite.url}\``)
            })
        }
    }
}