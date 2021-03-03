const { MessageEmbed, Client } = require('discord.js'),
    client = new Client()

module.exports = {
    name: 'help',
    aliases: ['h'],
    args: ['[keyword]'],
    description: [
        'このメッセージを表示します。',
        '<>で囲われているものは必須、[]で囲われているものは任意の引数です。',
        '引数にキーワードを渡すと該当するコマンドの詳細を表示します。'
    ],
    async execute(message, args, prefix) {

        let embed = {
            title: `Help | Prefix : ic.`,
            footer: { text: "コマンドの詳しい説明は、ic.help [コマンド名]" }
        };

        
        if(!args[0]){
            const help_embed = new MessageEmbed()
            .setAuthor("Help | Prefix : ic.")
            .setDescription("```\nこのBotはPrefixだけでなくメンションでも反応するようになっています\n```\n`ic.help` : これを表示します\n`ic.leaderboards` : 招待数のTOP10を表示します\n`ic.mylink` : 自分の招待リンクの一覧を表示します\n`ic.link_info` : 招待リンクの情報を表示します")
            .setFooter("コマンドの詳しい説明は、ic.help [コマンド名]")

            message.channel.send(help_embed)
        }else{

            const details_command = (command) => {
                if (command) {
                    let aliases = '';
                    if (command.aliases.length) aliases = `aliases: \`${command.aliases.join('\`, \`')}\``;
    
                    embed.fields = {
                        name: `${prefix}${command.name} ${command.args.join(' ')}`,
                        value: `${aliases}\n\`\`\`\n${command.description.join('\n')}\n\`\`\``
                    };
                } else {
                    embed.fields = {
                        name: 'null',
                        value: 'Coming Soon'
                    };
                }
            }

            const command = helps.find( command => args[0] === command.name || (command.aliases && command.aliases.includes(args[0])) );
            if (command) {
                details_command(command);
            } else {
                embed.fields = {
                    name: `${args[0]} に一致するコマンドは見つかりませんでした。`,
                    value: '```\n検索のヒント:\n' +
                        '・キーワードに誤字・脱字がないか確認して下さい\n' +
                        '・別のキーワードを試してみて下さい\n' + 
                        '解決しない場合は、お手数ですが開発者まで連絡をお願いします。\n```'
                }
            }

            message.channel.send({embed:embed});
        }

        
    },
};