require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const cooldown = new Set();
const truewalletapi = require('./lib/TrueWallet');
const wallet = new truewalletapi(process.env.WALLET_NUMBER);

client.login(process.env.TOKEN);

client.on('ready', () => {
  client.user.setActivity('with ❤ by DearTanakorn#0154', { type: 'PLAYING' });
  console.log(`${client.user.tag} has been started!`);
});

client.on('message', (message) => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (cooldown.has(message.author.id)) {
    return message.channel.send(errorEmbed('โปรดลองอีกครั้งใน 5 วินาที')).then((msg) => msg.delete({ timeout: 5000 }));
  } else {
    cooldown.add(message.author.id);
    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, 5000);
  }

  if (command === 'ping') {
    message.channel.send(`Latency is ${Date.now() - message.createdTimestamp}ms.\nAPI Latency is ${Math.round(client.ws.ping)}ms.`).then((msg) => msg.delete({ timeout: 5000 }));
  } else if (command === 'redeem') {
    if (message.channel.type != 'dm') {
      if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) {
        message.channel.send(errorEmbed('โปรดให้ Permission : Manage Messages เพื่อความปลอดภัยของลิ้งค์อั่งเปาในอนาคต')).then((msg) => msg.delete({ timeout: 30000 }));
      } else {
        message.delete();
      }
    }
    if (!process.env.WALLET_NUMBER) return message.channel.send(errorEmbed('เจ้าของบอทยังไม่ได้ตั้งเบอร์โทร ⚠')).then((msg) => msg.delete({ timeout: 5000 }));
    
    if (!args[0]) return message.channel.send(errorEmbed('โปรดใส่ลิ้งค์อั่งเปา! ⚠')).then((msg) => msg.delete({ timeout: 5000 }));
    if (!args[0].startsWith('https://gift.truemoney.com/campaign/?v=')) return message.channel.send(errorEmbed('โปรดใส่ลิ้งค์อั่งเปาที่ถูกต้อง ⚠')).then((msg) => msg.delete({ timeout: 5000 }));
    message.channel.send(checkEmbed('กรุณารอสักครู่ ระบบกำลังตรวจสอบ ⚠')).then(async (m) => {
      try {
        let response = await wallet.redeem(args[0]);
        
        return m.edit(successEmbed(`<@${message.author.id}> สำเร็จ ✅ จำนวนเงิน ${response.data.my_ticket.amount_baht}`));
      } catch (err) {
        if (err.status === 400 || err.status === 404) return m.edit(errorEmbed('Link ไม่ถูกต้อง อาจจะถูกใช้ไปแล้วหรือหมดอายุ ❌')).then((msg) => msg.delete({ timeout: 5000 }));
        
        console.log(err);
        return m.edit(errorEmbed('ตรวจพบปัญหาบางอย่างไม่ทราบสาเหตุโปรดติดต่อผู้ทำบอท ⚠')).then((msg) => msg.delete({ timeout: 5000 }));
      }
    });
  }
});

function errorEmbed(text) {
  return new Discord.MessageEmbed()
    .setTitle(client.user.tag)
    .setAuthor('TrueWallet VoucherTopup', client.user.avatarURL({ size: 256 }))
    .setColor('#ff0000')
    .setDescription(text)
    .setFooter('Made with 💓 by DearTanakorn#0154', 'https://cdn.discordapp.com/avatars/270112831360204812/1139c6b055aeed0fb7eb4d2ebd55d623.webp?size=256')
    .setThumbnail('https://cdn.discordapp.com/attachments/835953823021006859/859518966221504532/208049397_3089639694613834_2020445386962329261_n.png')
    .setTimestamp();
}

function checkEmbed(text) {
  return new Discord.MessageEmbed()
    .setTitle(client.user.tag)
    .setAuthor('TrueWallet VoucherTopup', client.user.avatarURL({ size: 256 }))
    .setColor('#ffc800')
    .setDescription(text)
    .setFooter('Made with 💓 by DearTanakorn#0154', 'https://cdn.discordapp.com/avatars/270112831360204812/1139c6b055aeed0fb7eb4d2ebd55d623.webp?size=256')
    .setThumbnail('https://cdn.discordapp.com/attachments/835953823021006859/859518966221504532/208049397_3089639694613834_2020445386962329261_n.png')
    .setTimestamp();
}

function successEmbed(text) {
  return new Discord.MessageEmbed()
    .setTitle(client.user.tag)
    .setAuthor('TrueWallet VoucherTopup', client.user.avatarURL({ size: 256 }))
    .setColor('#64ff00')
    .setDescription(text)
    .setFooter('Made with 💓 by DearTanakorn#0154', 'https://cdn.discordapp.com/avatars/270112831360204812/1139c6b055aeed0fb7eb4d2ebd55d623.webp?size=256')
    .setThumbnail('https://cdn.discordapp.com/attachments/835953823021006859/859518966221504532/208049397_3089639694613834_2020445386962329261_n.png')
    .setTimestamp();
}
