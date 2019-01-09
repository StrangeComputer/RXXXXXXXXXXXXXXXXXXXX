const Discord = require(`discord.js`);
const client = new Discord.Client();
const fs = require(`fs`);
const { inspect } = require(`util`); 
const request = require(`request`); 
let commands = require(`./Storage/commands.json`);
/** @namespace process.env.BOT_TOKEN */ 
module.exports = {
    0: `0⃣`, 1: `1⃣`,
    2: `2⃣`, 3: `3⃣`, 4: `4⃣`, 5: `5⃣`,
    6: `6⃣`, 7: `7⃣`, 8: `8⃣`, 9: `9`,
    10: `🔟`,
}; 
const emojis = {
    yoba: '469876460006670346',
    error: '520678073490866177',
    mark:'531569085180411906',
    cross:'531569085180411906'
}
let prefix = `/`; //Префикс

let muted = `530030325166899200`

const bot_name = `Akura`;
const version = `0.00.1`
const update = `Вышла версия ${version}. Обновления:\n\n1. Добавлена база данных для лучшего модерирования\n\n2. Изменена команда /help\n\n`;
const footer = `${bot_name}`
const creator = `327872942124040192`;

function randomInteger(min, max) {
    max++
    return Math.floor(Math.random() * (max - min)) + min;
}

function declOfNum(number, titles) {
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

async function multipleReact(message, arr) {
    if (arr !== []) {
        await message.react(arr.shift()).catch(console.error).then(function () {multipleReact(message,arr).catch();});
    }
}

function setBigTimeout(func, timeout) {
    if (timeout > 0x7FFFFFFF)
        setTimeout(function() {setBigTimeout(func, timeout-0x7FFFFFFF);}, 0x7FFFFFFF);
    else
        setTimeout(func, timeout);
}

client.on(`ready`, () => {
    client.user.setStatus("idle");
    client.user.setActivity(prefix + `help`,{ type: 0 });
    console.log(`Бот запущен успешно\n   Количество гильдий на которых присутствует бот: ${client.guilds.size}`
    );
});

client.on("message", async message => {

    if (message.channel.type === 'dm') {
        if ([client.user.id, '327872942124040192'].includes(message.author.id)) return;
        client.fetchUser(creator).then(user => user.send({
            embed: {
                author: {
                    name: 'Сообщение от ' + message.author.username + '#' + message.author.discriminator ,
                    icon_url: message.author.displayAvatarURL
                },
                color: 1710618,
                description: '``` ' + message.content + ' ```',

                timestamp: new Date(),
            }
        }))
    }

    let arr = [];
    message.guild.fetchInvites().then(invites => {
        invites.forEach(invite => {
        arr.push(invite.code); 
    })
    let matches = message.content.match(/discord(app\.com\/invite|\.gg|\.me|\.io)\/?([_a-zA-Z0-9]{1,32})/gi);
    if (matches)
        matches.forEach((match) => {
            if (!arr.includes(match.match(/discord(app\.com\/invite|.\w{2})\/\w{5,}/i)[3])) {
                message.delete();
                message.author.send('Ну вот и зачем? Неужели ты правила не читал?')
                client.fetchUser(creator).then(`${message.author} был забанен за рекламу.`)
                if (message.member.bannable) message.member.ban('Реклама.')
            }
        })
    });

    if(message.content.indexOf(prefix) !== 0) return;
    const poll = message.content.slice(prefix.length).trim().split(/;+/g);
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    function sendMsg (msg) {
        message.channel.send(msg)
    }
    function actMSg (actType, actioner, time, reason) {
        let act = ``;
        let desc = ``;
        let other = ``;
        if (actType === 'mute') {act = 'замучены'; desc = `Время: **${time}**\n`; other = '\n\nНе ведите себя плохо!'}
        if (actType === 'warn') {act = 'предупреждены'; other = '\n\nНе ведите себя плохо!'} 
        if (actType === 'ban') {act = 'забанены'; other = '\n\nНе ведите себя плохо!'}
        if (actType === 'unban') {act = 'разбанены';}
        if (actType === 'kick') {act = 'выгнаны'; other = '\n\nНе ведите себя плохо!'}
        if (actType === 'unmute') {act = 'размучены'}
        if (reason === 'autoUnmt') {actioner = bot_name; reason = 'Автоматический размут'}
        if (reason === undefined) reason = 'Не указана'
        const embed = new Discord.RichEmbed()
        .setColor("af00ff")
        .setTitle(`Вы были ${act} на ${message.guild.name}`)
            .setDescription(`\nПользователем: **${actioner}**\n${desc} Причина: **${reason}** \n\n**${other}**`)
            .setFooter(footer)
            .setTimestamp();
        return embed;
    }
    
    function err (reason, missPerms) {
        if (!missPerms) {
            const embed = new Discord.RichEmbed()
            .setTitle("Произошла ошибка")
            .setColor("282b30")
            .setDescription('Причина : **' + reason + '**')
            .setFooter(bot_name)
            .setTimestamp();
            return message.channel.send({embed})
        }
        const embed = new Discord.RichEmbed()
            .setTitle("Недостаточно прав")
            .setColor("282b30")
            .setDescription('Вы не можете использовать эту команду\nУ вас должно быть право `' + missPerms + '`')
            .setFooter(bot_name)
            .setTimestamp();
            return message.channel.send({embed})
    } 
    
    function succ (msg) {
        const embed = new Discord.RichEmbed()
            .setTitle("Успех")
            .setColor("282b30")
            .setDescription(msg)
            .setFooter(bot_name)
            .setTimestamp();
            return message.channel.send({embed})
    }
    let reactCmds = ['hug', 'kiss', 'slap', 'pat', 'poke', 'cuddle', 'tickle', 'feed', 'baka'];
    let acts = ['обнял(а)', 'поцеловал(а)', 'дал(а) пощечину', 'погладил(а) по голове', 'тыкнул(а) в', 'прижался(ась) к', 'пощекотал(а)', 'дал(а) еды', 'обозвал(а)'];
    if (reactCmds.includes(command)) {
        let user = message.mentions.members.first();
        if (!args[0]) user = client.user
            if (!user) user = args[0];
            let act = '';
            for (let i = 0; i <= reactCmds.length; i++) {
                if (command === reactCmds[i]) {
                    act = acts[i] 
                    request('https://nekos.life/api/v2/img/' + command, function (error, response, body) {
                        let arr = JSON.parse(body);
                        let embed = new Discord.RichEmbed()
                        .setDescription(`${message.author} **${act}** ${user}`)
                        .setImage(arr['url'])
                        .setColor('af00ff')
                        .setFooter(footer) 
                        .setTimestamp();
                        message.channel.send({embed}).then(()=> {message.delete();})
                    });
                }
            }
    }

    if (['test'].includes(command)) {
        message.channel.startTyping();
        const embed = new Discord.RichEmbed()
        .setTitle(`Бот "${bot_name}"`)
        .setThumbnail(client.user.avatarURL)
        .addField(`Пинг :ping_pong:`, `${Math.round(client.ping)} ms`, true)
        .addField(`Юзеры :bust_in_silhouette:`, `${client.users.size} users`, true)
        .addField(`Каналы :keyboard:`, `${client.channels.size} channels`, true)
        .addField(`Сервера :desktop:`, `${client.guilds.size} servers`, true)
        .addField(`Создатель :hammer_pick:`, `Monstrosus Satan#0666`, true)
        .addField(`Работает на :computer:`, `JS, node.js, discord.js 11.4.2`, true)
        .addField(`Время работы :stopwatch:`, `${Math.round(client.uptime / (1000 * 60 * 60))} hours, ${Math.round(client.uptime / (1000 * 60)) % 60} minutes`, true)
        .addField(`Включен :on:`, client.readyAt.toString().slice(4, -15), true)
        .addField(`Версия :floppy_disk:`, version, true)
        .addField(`Авторизация :key:`, client.user.tag, true)
        .addField(`Эмодзи :joy:`, `${client.emojis.size} emojis`, true)
        .addField(`Голосовые каналы :microphone:`, `${client.voiceConnections.size} channels`, true)
        .setColor('FAA61A')
        message.channel.stopTyping(true)
        message.channel.send({embed});
    }


    if (['emoji-info', 'ei', 'e-i'].includes(command)) {
        if (!args[0]) return err('Пустотный эмодзи???')
        if (args[0].match(/<:\w+:\d+>/)) args[0] = args[0].slice(2).slice(0, -20)
        if (!message.guild.emojis.find('name', args[0])) return err('Я не могу найти эмодзи "' + args[0] + '"');
        let emoji = message.guild.emojis.find('name', args[0]);
        emoji.fetchAuthor().then(author => {
            const embed = new Discord.RichEmbed()
            .setTitle(`Эмодзи ${emoji}`)
            .setColor(`FAA61A`)
            .setThumbnail(emoji.url)
            .addField(`Имя`, emoji.name, true)
            .addField(`Приватен для?`, `${emoji.roles.size} ролей`, true)
            .addField(`Добавил`, author.tag, true)
            .addField(`Дата добавления`, emoji.createdAt.toString().slice(4, -15), true)
            .addField(`Анимированный?`, (emoji.animated?`Да`:`Нет`), true)
            .addField(`Ссылка`, emoji.url, true)
            message.channel.send({embed})
        })
    }
    if (['profile', 'prof'].includes(command)) {
        let user = message.mentions.members.first();
        if (!user) user = message.member;
        let stat
        if (user.user.presence.status === 'online') stat = 'Онлайн'
        if (user.user.presence.status === 'dnd') stat = 'Не беспокоить'
        if (user.user.presence.status === 'idle') stat = 'Не активен'
        if (user.user.presence.status === 'offline') stat = 'Оффлайн'
        let voiceChannel
        let voiceChannelGuild = ''
        if (!user.voiceChannel) {
            voiceChannel = 'Нет'
        }
        else {
            voiceChannel = user.voiceChannel.name
            voiceChannelGuild = `на **${user.voiceChannel.guild.name}**`
        }
        if (user.highestRole === null) user.highestRole = 'Нет'
        const embed = new Discord.RichEmbed()
        .setTitle(`Пользователь ${user.user.tag}`)
        .setColor('FAA61A')
        .setThumbnail(user.user.avatarURL)
        .addField(`Авторизация :key:`, `${user.user}\n${user.user.tag}`, true)
        .addField(`Присоединился :inbox_tray:`, `На сервер: ${user.joinedAt.toString().slice(4, -15)}\nК Discord: ${user.user.createdAt.toString().slice(4, -15)}`, true)
        .addField(`Статус :bulb:`, stat, true)
        .addField(`В голосовом канале? :microphone2:`, `**${voiceChannel}** ${voiceChannelGuild}`, true)
        .addField(`Бот? :robot:`, (user.user.bot?`Да`:`Нет`), true)
        .addField(`Окрашивающая роль :paintbrush:`, user.colorRole, true)
        .addField(`Высшая роль :first_place:`, user.highestRole, true)
        message.channel.send({embed})
    }
    if (['server-info', 'si', 'guild-info', 'gi', 'g-i', 's-i'].includes(command)) {
        let afkChannel = 'Нет'
        let afkTimeout = 'Нет';
        let voiceChannels = [];
        let textChannels = [];
        let categoryChannels = [];
        let bots = [];
        let members = [];
        let verifLvl = message.guild.verificationLevel
        if (message.guild.afkChannel !== null) {
            afkChannel = message.guild.afkChannel.name
            afkTimeout = `${Math.round(message.guild.afkTimeout / 60)} minutes`
        }
        message.guild.region = message.guild.region[0].toUpperCase() + message.guild.region.slice(1)
        message.guild.fetchBans().then(bans => {
            message.guild.fetchInvites().then(invites => {
                message.guild.channels.forEach(channel => {
                    if (channel.type === "voice") voiceChannels.push(channel);
                    if (channel.type === "text") textChannels.push(channel);
                    if (channel.type === "category") categoryChannels.push(channel);
                })
                message.guild.members.forEach(member => {
                    if (member.user.bot) bots.push(member);
                    else members.push(member);
                })
                if (verifLvl === 0) verifLvl = 'Нет'
                if (verifLvl === 1) verifLvl = 'Низкий'
                if (verifLvl === 2) verifLvl = 'Средний'
                if (verifLvl === 3) verifLvl = '(╯°□°）╯︵ ┻━┻'
                if (verifLvl === 4) verifLvl = '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
                const embed = new Discord.RichEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL)
                .setColor('FAA61A')
                .setThumbnail(message.guild.iconURL)
                .addField(`Сокращение :arrow_right: :arrow_left:`, message.guild.nameAcronym, true)
                .addField(`Создан :date:`, message.guild.createdAt.toString().slice(4, -15), true)
                .addField(`Основатель`, message.guild.owner.user.tag, true)
                .addField(`Пользователи :bust_in_silhouette:`, `${message.guild.memberCount} (${bots.length} bots, ${members.length} people)`, true)
                .addField(`AFK Канал :zzz:`, afkChannel, true)
                .addField(`AFK Тайм-аут :watch:`, afkTimeout, true)
                .addField(`Регион :globe_with_meridians:`, message.guild.region,true)
                .addField(`Количество банов :hammer:`, `${bans.size} bans`, true)
                .addField(`Каналы :mouse_three_button:`, `${message.guild.channels.size} (${voiceChannels.length} voice, ${textChannels.length} text, ${categoryChannels.length} categories)`, true)
                .addField(`Приглашения :inbox_tray:`, `${invites.size} invites`, true)
                .addField(`Роли :military_medal:`, `${message.guild.roles.size} roles`, true)
                .addField(`Эмодзи :joy:`, `${message.guild.emojis.size} emojis`, true)
                .addField(`Уровень верификации :gear:`, verifLvl, true)
                .addField(`Подтвержден? :white_check_mark:`, (message.guild.verified?'Да':'Нет'), true)
                message.channel.send({embed})
            })
        })
    }
    if (['role-info', 'ri', 'r-i'].includes(command)) {
        let role = message.mentions.roles.first();
        if (!role) {
            if (!message.guild.roles.find('name', args[0])) return err('Такой роли не существует');
            role = message.guild.roles.find('name', args[0])
        }
        let perms = [];
        if (role.hasPermission("ADMINISTRATOR")) perms.push('Администратор :exclamination:');
        else {
            if (role.hasPermission("VIEW_AUDIT_LOG")) perms.push('Просмотр журнала аудита :eye:');
            if (role.hasPermission("MANAGE_GUILD")) perms.push('Управление сервером :level_slider:');
            if (role.hasPermission("MANAGE_ROLES")) perms.push('Управление ролями :trophy:');
            if (role.hasPermission("MANAGE_CHANNELS")) perms.push('Управление каналами :keyboard:');
            if (role.hasPermission("KICK_MEMBERS")) perms.push('Кикать пользователей :point_right:');
            if (role.hasPermission("BAN_MEMBERS")) perms.push('Банить пользователей :hammer:');
            if (role.hasPermission("CREATE_INSTANT_INVITE")) perms.push('Создавать ссылки-приглашения :inbox_tray:');
            if (role.hasPermission("CHANGE_NICKNAME")) perms.push('Менять никнеймы :arrows_counterclockwise:');
            if (role.hasPermission("MANAGE_NICKNAMES")) perms.push('Управление никнеймами :arrows_counterclockwise: :level_slider:');
            if (role.hasPermission("MANAGE_EMOJIS")) perms.push('Управление эмодзи :joy:');
            if (role.hasPermission("MANAGE_WEBHOOKS")) perms.push('Управление вебхуками :gear:');
            if (role.hasPermission("VIEW_CHANNEL")) perms.push('Читать текстовые каналы и видеть голосовые каналы :eye_in_speech_bubble:');
            if (role.hasPermission("SEND_MESSAGES")) perms.push('Отправлять сообщения :speech_left:');
            if (role.hasPermission("SEND_TTS_MESSAGES")) perms.push('Отправлять /tts сообщения :speech_left: :loud_sound:');
            if (role.hasPermission("MANAGE_MESSAGES")) perms.push('Управление сообщениями :gear: :arrow_forward:');
            if (role.hasPermission("EMBED_LINKS")) perms.push('Встраивать ссылки :link:');
            if (role.hasPermission("ATTACH_FILES")) perms.push('Прикреплять файлы :file_folder:');
            if (role.hasPermission("READ_MESSAGE_HISTORY")) perms.push('Читать истоирию сообщений :clock3:');
            if (role.hasPermission("MENTION_EVERYONE")) perms.push('Упомянуть всех :loudspeaker:');
            if (role.hasPermission("USE_EXTERNAL_EMOJIS")) perms.push(`Использовать внешние эмодзи ${client.emojis.get(emojis.yoba)}`);
            if (role.hasPermission("ADD_REACTIONS")) perms.push('Добавлять реакции :grinning:');
            if (role.hasPermission("CONNECT")) perms.push('Подключиться :joystick:');
            if (role.hasPermission("SPEAK")) perms.push('Говорить :loud_sound:');
            if (role.hasPermission("MUTE_MEMBERS")) perms.push('Отключить голос другим :zipper_mouth:');
            if (role.hasPermission("DEAFEN_MEMBERS")) perms.push('Отключить звук другим :mute:');
            if (role.hasPermission("MOVE_MEMBERS")) perms.push('Перемещать пользователей :arrow_down:');
            if (role.hasPermission("USE_VAD")) perms.push('Использовать режим активации по голосу :lips:');
            if (role.hasPermission("PRIORITY_SPEAKER")) perms.push('Главный говорящий :microphone2:');
        }
        if (perms.length === 0) perms = ['Нет']
            const embed = new Discord.RichEmbed()
            .setTitle(`Права роли ${role.name}`)
            .setColor('FAA61A')
            .addField(`Mention :regional_indicator_m:`, role, true)
            .addField(`Цвет :art:`, `${role.hexColor}`, true)
            .addField(`Создана :gear:`, role.createdAt.toString().slice(4, -15), true)
            .addField(`Отображается? :desktop:`, (role.hoist?'Да':'Нет'), true)
            .addField(`Упоминаемая? :bulb:`, (role.mentionable?'Да':'Нет'), true)
            .setDescription(`**${perms.join('**\n**')}**`)
            message.channel.send({embed})
    }
    if(command === 'update') {
        message.delete();
        const embed = new Discord.RichEmbed()
            .setTitle("Обновления")
            .setColor('FAA61A')
            .setDescription(update)
            .setFooter(bot_name + " | " + version)
            .setTimestamp();
        message.channel.send({embed});
    }

    if (command === 'blob') message.channel.send(`\\${client.emojis.get('494808660808302592')}`).then(() => message.delete());
    if (command === 'guilds' && message.author.id === creator) message.reply(client.guilds.size);
    if (['8ball', 'ball', '8'].includes(command)) {
        const answers = ['Без сомннения!', 'Да, конечно', 'Да', 'Вроде да', 'Возможно', 'Абсолютно нет!', 'Никак нет', 'Нет', 'Неа', 'Cомневаюсь', 'Спроси позднее, я не знаю']
        const numOfAnswer = randomInteger(0, 10);
        if (!args[0]) return message.reply('Ошибка. Причина: **Не указан аргумент**\n\nПравильное использование:\n=8ball `<вопрос>`')
        message.reply(answers[numOfAnswer]);
    };
    if (['ship', 'love', 'шип'].includes(command)) {
        if (!args[0]) args[0] = message.guild.members.random();
        if (!args[1]) args[1] = message.author
        const loveTexts = ['Хуже некуда :poop:', 'Ужасно :sob:', 'Очень плохо :disappointed_relieved:', 'Плохо :frowning2:', 'Средне :thinking:', 'Неплохо :confused:', 'Дружески :+1:', 'Ууу ( ͡° ͜ʖ ͡°)', 'Превосходно! :heartpulse:', 'Невероятно!!! :heart_eyes:', 'ИДЕАЛЬНО!!! :heart_exclamation:'];
        const percents = randomInteger(0, 100);
        const loveText = loveTexts[Math.floor(percents / 10)];
        let line = ''
        let whiteLine = ''
        for (let i = 0; i <= percents; i = i + 10) line += '■';
        for (let i = 0; i < 100 - percents; i = i + 10) whiteLine += '□';
        const embed = new Discord.RichEmbed()
            .setTitle(":heart:МАТЧМЕЙКИНГ:heart:")
            .setColor('FAA61A')
            .setDescription('▼***' + args[0] + '***\n▲***' + args[1] + '***\n\n:revolving_hearts:Любовь в проценатах: **' + percents + '%** `[' + line + whiteLine + ']`' + '\n\nВердикт: **' + loveText + '**')
            .setFooter(bot_name + " | " + version + " | Все права защищены")
            .setTimestamp();
        message.channel.send({embed});
    }
    if (command === 'say') {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return err(0, 'Управление сообщениями');
        message.delete().catch(() => {return err('У меня недостаточно прав')});
        message.channel.send(args.join(" ")).catch(() => {return err('Не указано сообщение')});
    }
    if (command === 'send') {
        let user = message.mentions.members.first();
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return err(0, 'Управление сообщениями');
        message.delete().catch(() => {return err('У меня недостаточно прав')});
        user.send(args.join(" ").slice(user.toString.length)).catch(() => {return err('Не указано сообщение')});
    }
    if (command === 'sms') {
        let user = message.mentions.members.first();
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return err(0, 'Управление сообщениями');
        message.delete().catch(() => {return err('У меня недостаточно прав')});
        user.send('**' + message.author.tag + ' (' + message.author + ') Отправил вам SMS следующего содержания:**\n' + args.join(" ")).slice(user.toString.length).catch(() => {return err('Не указано сообщение')});
    }
    if(['poll', 'vote'].includes(command)) {
        if (!poll[1]) return err('Нельзя создавать пустые голосования');
        const question = args.join(' ').match(/(.*?);/g)[0].slice(0, -1);      
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return err(0, 'Управление сообщениями')
        if (poll[11]) return err('Голосование нельзя делать более чем с 10-тью вариантами')
        let variants = ''
        for (let i = 1; i < poll.length; i++) variants += module.exports[i] + ' — ' + poll[i] + '\n'
        message.channel.send(':bar_chart: **' + question + '**');
        const embed = new Discord.RichEmbed()
            .setDescription(variants)
            .setColor('FAA61A')
            .setFooter(footer)
            .setTimestamp();
        message.delete();
        message.channel.send({embed}).catch(() => {return err('Лимит в 2000 символов превышен')}).then(msg => {for (let i = 1;i < poll.length; i++) msg.react(module.exports[i])});
    };
    if (command === 'eval') {
        if (message.author.id !== creator) return message.channel.send('Доступ запрещен.');
        const code = args.join(" ").replace(/client\.token|client\[.token.\]/ig, 'process.env.TOKEN');        
        const token = client.token.split("").join("[^]{0,2}");
        const rev = client.token.split("").reverse().join("[^]{0,2}");
        const filter = new RegExp(`${token}|${rev}`, "g");
        try {
            let output = eval(code);
            if (output instanceof Promise || (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")) output = output;
            output = inspect(output, { depth: 0, maxArrayLength: null });
            output = output.replace(filter, "[TOKEN]");
            output = clean(output);
            if (output.length < 1950) message.channel.send(`\`\`\`js\n${output}\n\`\`\``).then(() => {message.react("✅")});
            else message.channel.send(`${output}`, {split:"\n", code:"js"});
        } catch (error) {message.channel.send(`Анхэндлэд промайз риджекшн ворнинг \`\`\`js\n${error}\`\`\``).then(() => {message.react("❎");});}
        function clean(text)  {
            return text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203));
        }
    }
    if (['idea', 'id'].includes(command)) client.fetchUser(creator).then(user => user.send('Пользователь ' + message.author + ' отправил вам идею: ' + args.join(" ")).catch(() => {err('Не указана идея')}).then(() => {message.channel.send(`Идея была успешно отправлена ${client.emojis.get(emojis.mark)}`)}));
    if (['bug', 'bg'].includes(command)) client.fetchUser(creator).then(user => user.send('Пользователь ' + message.author + ' отправил вам баг: ' + args.join(" ")).catch(() => {err('Не указан баг')}).then(() => {message.channel.send(`Баг был успешно отправлен ${client.emojis.get(emojis.mark)}`)}));
    if (['clear', 'delete', 'del', 'clr', 'сдк', 'вуд', 'сдуфк', 'вудуеу'].includes(command)) {
        async function clear() {
            if (isNaN(args[0])) return err('Аргумент должен являться числом');
            let msgs = parseInt(args[0]);
            if (!message.member.hasPermission("MANAGE_MESSAGES")) return err(0, 'Управление сообщениями');
                if (msgs < 2)return err('Аргумент не может являться нулем или единицей');
                if (msgs + 1 >= 99) msgs = 98;
                message.channel.bulkDelete(await message.channel.fetchMessages({limit: msgs + 1})).catch();
                message.channel.send("Было успешно удалено **" + msgs + "** " + declOfNum(msgs, ['сообщение', 'сообщения', 'сообщений'])).then(msg => msg.delete(5000));
        }
        clear();
    }
    if (['warn', 'варн', 'цфкт'].includes(command)) {
        let user = message.mentions.members.first(); 
        if (!message.member.hasPermission("KICK_MEMBERS")) return err(0, 'Кикать участников')
        if (!user) return err('Вы забыли упомянуть пользователя или вы хотите предупредить того, кто не является пользователем');
        if (user.id === message.author.id) return message.channel.send('Зачем ты пытаешься сделать предупреждение самому себе?');
        let reason = args.splice(0, 1).join(" ");
        if (!reason) return err('Предупреждать без причины нельзя');
        user.send(actMSg('warn', message.author, 0, reason));
        message.channel.send('Пользователь ' + user + ' был предупрежден успешно');
    }
    if (['kick', 'кик', 'лшсл'].includes(command)) {
        let user = message.mentions.members.first(); 
        if (!message.member.hasPermission("KICK_MEMBERS")) return err(0, 'Кикать участников')
        if (!user) return err('Вы забыли упомянуть пользователя или вы хотите кикнуть того, кто не является пользователем');
        if (user.id === message.author.id) return message.channel.send('Зачем ты пытаешься кикнуть самого себя?');
        let reason = args.splice(0, 1).join(" ");
        if (!reason) return err('Кикать без причины нельзя');
        user.send(actMSg('kick', message.author, 0, reason));
        message.channel.send('Пользователь ' + user + ' кикнут успешно').then(() => {if (user.kickable) user.kick(reason)});
    }


    if (['ban', 'бан', 'ифт', 'банан', 'бунан'].includes(command)) {
        let user = message.mentions.members.first(); 
        if (!message.member.hasPermission("BAN_MEMBERS")) return err(0, 'Банить участников')
        if (!user) return err('Вы забыли упомянуть пользователя или вы хотите забанить того, кто не является пользователем');
        if (user.id === message.author.id) return message.channel.send('Зачем ты пытаешься забанить самого себя?');
        let reason = args.slice(0, 1).join(" ");
        if (!reason) return err('Банить без причины нельзя');
        if (!user.bannable) return err('Я не могу его забанить');
        user.send(actMSg('ban', message.author, 0, reason)).catch();
        message.channel.send('Пользователь ' + user + ' забанен успешно').then(() => user.ban(reason));
    }
    if (['unban', 'анбан', 'гтифт', 'забрать-банан', 'забрать-бунан'].includes(command)) {
        let userid = args[0];
        if (!message.member.hasPermission("BAN_MEMBERS")) return err(0, 'Банить участников')
        if (!userid) return err('Не указан ID');
        if (userid === message.author.id) return message.channel.send('Разбанить самого себя? умно, умно');
        let reason = args.slice(0, 1).join(" ");
        message.guild.unban(userid, reason).then(() => {message.channel.send('Пользователь под id ' + userid + ' разбанен успешно');}).catch(() => {err('Этот пользователь не забанен')});
    }
    if (['ьгеу', 'mute', 'мут'].includes(command)) {
        let user = message.mentions.members.first(); 
        if (!message.member.hasPermission("KICK_MEMBERS")) return err(0, 'Кикать пользователей');
        if (!user) return message.channel.send(message.author + ', Ошибка. Причина: **Вы забыли упомянуть пользователя или вы хотите замутить того, кто не является пользователем**');
        if (user.id == message.author.id) return message.channel.send('Зачем ты пытаешься замутить самого себя?');
        function getSeconds(str) {
            let seconds = 0;
            let years = str.match(/(\d+)\s*y/);
            let months = str.match(/(\d+)\s*M/);
            let weeks = str.match(/(\d+)\s*w/);
            let days = str.match(/(\d+)\s*d/);
            let hours = str.match(/(\d+)\s*h/);
            let minutes = str.match(/(\d+)\s*m/);
            let secs = str.match(/(\d+)\s*s/);
            if (years) { seconds += parseInt(years[1])*31556926; }
            if (months) { seconds += parseInt(months[1])*2592000; }
            if (weeks) { seconds += parseInt(weeks[1])*604800; }
            if (days) { seconds += parseInt(days[1])*86400; }
            if (hours) { seconds += parseInt(hours[1])*3600; }
            if (minutes) { seconds += parseInt(minutes[1])*60; }
            if (secs) { seconds += parseInt(secs[1]); }
            return seconds;
        }
        let reason = args.join(" ").slice(0, 2);
        if (args[1] && getSeconds(args[1]) === 0 ) return err('Мутить на 0 секунд нельзя');
        user.addRole(muted);
        user.send(actMSg('mute', message.author, args[1], reason));
        message.channel.send(user + ' был успешно замучен');
        setBigTimeout(() => {
            if (!message.member.roles.some(r=> [muted].includes(r.id))) return
            user.send(actMSg('autoUnmt', bot_name, 0, 0));
            user.removeRole(muted);
            message.channel.send(user + ' был размучен');
            }, getSeconds(args[1])*1000);
        }
        if (['unmute', 'гтьгеу'].includes(command)) {
            let user = message.mentions.members.first();
            if (!message.member.hasPermission("KICK_MEMBERS")) return err(0, 'Кикать участников')
            if (!user) return err('Вы забыли упомянуть пользователя или хотите размутить того, кто не является пользователем');
            if (!message.member.roles.some(r=> [muted].includes(r.id))) return err('Пользователь и так не замучен');
            let reason = args.join(" ").slice(0, 1);
            user.removeRole(muted);
            message.channel.send(user + ' был размучен');
            user.send(actMSg('unmute', message.author, 0, reason));
        }

        if(command === "wbcreate"){
            if (message.author.id !== creator) return message.channel.send('Доступ запрещен.');
            message.channel.createWebhook("Kyoko", "https://cdn.discordapp.com/avatars/375750637540868107/d4903501fad0e077eb902cf0b0a0dc7c.png")
            .then(webhook => webhook.edit("Kyoko", "https://cdn.discordapp.com/avatars/375750637540868107/d4903501fad0e077eb902cf0b0a0dc7c.png")
            .then(wb => client.fetchUser(creator).then(user => user.send(`<@327872942124040192>, создан вебхук на сервере ${message.channel.guild.name} в канале ${message.channel}.\nСсылка на сам вебхук ниже.\nhttps://discordapp.com/api/webhooks/${wb.id}/${wb.token}`))).catch(console.error))
            message.delete();
        }

        if (['avatar', 'av', 'аватар', 'ав', 'ava', 'ава'].includes(command)) {
            let user = message.mentions.members.first();
            if (!user) user = message.member
            const embed = new Discord.RichEmbed()
            .setTitle('Аватар')
            .setColor('af00ff')
            .setDescription('Пользователя ' + user.user.tag + '(' + user + ')')
            .setImage(user.user.avatarURL)
            .setFooter(footer)
            .setTimestamp();
            message.channel.send({embed}).then(() => {message.delete()});
        }
        if (['random', 'rand'].includes(command)) {
            if (!args[0] || isNaN(args[0])) args[0] = 0;
            if (!args[1] || isNaN(args[1])) args[1] = 10;
            let num1 = parseInt(args[0]);
            let num2 = parseInt(args[1]);
            if (num1 > num2) return err('Такая глупая ошибка что даже комментировать ее не хочу');
            const embed = new Discord.RichEmbed()
                .setTitle('Случайное число от ' + num1 + ' до ' + num2)
                .setColor('FAA61A')
                .setDescription('Выпало число **' + randomInteger(num1, num2) + '** :game_die: ')
                .setFooter(footer)
                .setTimestamp();
            message.channel.send({embed});
        };
    if (['help', 'рудз', 'хелп', 'помощь'].includes(command)) {
        if (isNaN(parseInt(args[1]))) args[1] = 1
        const page = parseInt(args[1]);
        if (!args[0] || !['m', 's', 'f', 'standart', 'moderation', 'fun', 'mod', 'stand'].includes(args[0].toLowerCase())) {
            const embed = new Discord.RichEmbed()
                .setTitle('Помощь')
                .setColor('FAA61A')
                .setDescription('Вы не указали модуль. Существющие модули:\n\n***1. - standart\n2. - moderation\n3. - fun***\n\nПримеры: ' + prefix + 'help m, ' + prefix + 'help s 2')
                .setFooter(footer)
                .setTimestamp();
            return message.channel.send({embed});
        }
        let category = args[0][0].toLowerCase();
        let categories = [];
        let tempDesc = '';
        let cmd = 0;
        let params = '`[...]` — Необязательный параметр\n`<...>` — Обязательный параметр\n\n';
        for (let i in commands) if (!categories.includes(commands[i].type)) categories.push(commands[i].category);
        const embed = new Discord.RichEmbed()
        .setColor('af00ff')
        .setTimestamp()
        for (let i in commands) if (category === commands[i].type) {
            cmd++;
            if (page === 1 && cmd <= 10) {
                tempDesc += `**${prefix}${commands[i].name}**`;
                for (let a in commands[i].args) tempDesc += ' `' + commands[i].args[a] + '` ';
                if (commands[i].perm) tempDesc += '(Требуется право: `' + commands[i].perm + '`)';
                tempDesc += ` — ${commands[i].desc}\n\n`;
                embed.setDescription(params + tempDesc);
                continue;
            }
            if (cmd >= page * 10 - 9 && page > 1) {
                tempDesc += `**${prefix}${commands[i].name}**`;
                for (let a in commands[i].args) {
                    if (!commands[i].args) continue;
                    tempDesc += ' `' + commands[i].args[a] + '` ';
                }
                if (commands[i].perm) tempDesc += '(Требется право: `' + commands[i].perm + '`)';
                tempDesc += ` — ${commands[i].desc}\n\n`;
                embed.setDescription(params + tempDesc);
            }
            embed.setFooter('Страница ' + page + '/' + Math.ceil(cmd / 10))
        }
        if (cmd < page * 10 - 10 && page > 1 || page <= 0) return err('Такой страницы не существует');
        if (category === 'm') category = 'модерация';
        if (category === 's') category = 'стандартные';
        if (category === 'f') category = 'развлечения';
        embed.setTitle('Команды модуля ' + category + '') ;
        message.channel.send({embed});
    }
});



client.login(process.env.BOT_TOKEN);
