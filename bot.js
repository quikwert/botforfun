const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const config = require("./bot-config.json");
bot.login(config.token);
const fs = require("fs");
const { Console } = require('console');
bot.on("ready", () => {
    console.log(`Bot Launched! ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"],["KICK MEMBERS"]).then(link => {
      console.log(link);
      
    });
  });

  fs.readdir("./cmds/", (err, files) => {
    if (err) console.log(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) console.log("no command to load");
    console.log(`loaded ${jsfiles.length} commands`);
    jsfiles.forEach((f, i) => {
      let props = require(`./cmds/${f}`);
      console.log(`${i + 1}.${f} is loaded!`);      
      bot.commands.set(props.help.name, props);
      console.log(bot.commands);
      
    });
  });

bot.on("message",async message =>{
    
    if (message.author.bot) return;
    if (message.channel.type == "dm") return;
    let user = message.author.username;
    let userid = message.author.id;
    let messageArray = message.content.split(" ");
    let command = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    let prefix = config.prefix;
    if (!message.content.startsWith(prefix)) return;
    let cmd = bot.commands.get(command.slice(prefix.length));
    console.log(cmd);
    if (cmd) {
      console.log("RUN " + command);
      cmd.run(bot, message, args);
    }
   
});