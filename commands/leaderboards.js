const {MessageEmbed} = require('discord.js')

module.exports = {
    name: 'leaderboards',
    hidden: false,
    aliases: ['lb'],
    args: [],
    description: ["招待数ランキングを表示します"],
    async execute(message) {

        if(!message.guild.me.permissions.has(("CREATE_INSTANT_INVITE"))) return await message.channel.send("このコマンドの実行には、権限:「招待の作成」が必要です")
        const invites = await message.guild.invites.fetch()
        const inviteCounter = {}

        invites.forEach((invite => {
            const { uses, inviter } = invite
            const { username } = inviter

            const name = `${username}`

            inviteCounter[name] = (inviteCounter[name] || 0) + uses
        }))

        let replyText = new MessageEmbed()
            .setDescription('')
            .setColor("BLUE")

        let NobodyText = new MessageEmbed()
            .setDescription('Nobody')
            .setColor("BLUE")

        const sortedInvites = Object.keys(inviteCounter).sort((a, b) => inviteCounter[b] - inviteCounter[a])

        if (sortedInvites.length === 0) return message.channel.send({content: "Top Inviters", embeds: [NobodyText]})
        else if (sortedInvites.length > 10) sortedInvites.length = 10
        else  sortedInvites.length = sortedInvites.length

        let i = 1
        for ( const invite of sortedInvites ) {
            const count = inviteCounter[invite]
            replyText.description += `\n${i++} 🔸 **${invite}** *${count}* invites`
        }

            message.channel.send({content: "Top Inviters", embeds: [replyText]})
    }
}