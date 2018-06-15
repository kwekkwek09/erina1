const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true}); 
const fs = require("fs");
const ms = require("ms");
const superagent = require("superagent");
let xp = require("./xp.json");
let coins = require("./coins.json");
let cooldown = new Set();
let cdseconds = 3;


bot.on("ready", async() =>  {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity(",help | serving IPM and lord Licko!");
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type ==="dm" )return;


    let prefix = botconfig.prefix;
    let customprefix1 = botconfig.customprefix1;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    
    if(cmd === `${prefix}eat`){
        let stuff = args;
        let food = args.join(" ").slice(22);
        if(!stuff) return message.channel.send("What am I going to eat?")
        let varfood = ["It is not tasty!", "It is okay.", "Super tasty! I like it,", "Ughhhh! *undresses*. :yum:"]
        let fresult = Math.floor((Math.random() * varfood.length));
        message.channel.send(varfood[fresult]);
    } 
    if(cmd === `${prefix}say`){ 
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return;
        const sayMessage = args.join(" ");
        message.delete().catch();
        message.channel.send(sayMessage);
    }

    
    if(cmd === `${prefix}kick`){
        
        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!kUser) return message.channel.send("Can't find user!");
        if(kUser.id === message.author.id){
            return message.reply("You cannot kick yourself!");
        }
        let kReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("BAN_MEMBERS", "KICK_MEMBERS")) return message.channel.send("You don't have enough permission.")
        if(kUser.hasPermission("BAN_MEMBERS", "KICK_MEMBERS")) return message.channel.send("lmao u mad?");

        let kEmbed = new Discord.RichEmbed()
        .setTitle("Kicked User")
        .addField("Kicked User", kUser);

        message.guild.member(kUser).kick(kReason); 
        return;
    
    if(message.author.bot) return;
    if(message.channel.type ==="dm" )return;
    }
    if(cmd === `${prefix}dog`){
        let {body} = await superagent
        .get(`https://random.dog/woof.json`);

        let dogembed = new Discord.RichEmbed()
        .setColor("#ffa100")
        .setTitle("Dog")
        .setImage(body.url);

        message.channel.send(dogembed);
    }
    if(cmd === `${prefix}cat`){
        let {body} = await superagent
        .get(`http://aws.random.cat//meow`);

        let catembed = new Discord.RichEmbed()
        .setColor("#ffa100")
        .setTitle("Cat")
        .setImage(body.file);

        message.channel.send(catembed);
    }
    
    if(!coins[message.author.id]){
        coins[message.author.id] = {
            coins : 0

        };
    }

    let coinAmt = Math.floor(Math.random() * 2) + 5;
    let baseAmt = Math.floor(Math.random() * 2) + 5;
    console.log(`${message.author.username} has gained`, `${coinAmt}; ${baseAmt} coins`);

    if(coinAmt === baseAmt){
        coins[message.author.id] = {
            coins: coins[message.author.id].coins + coinAmt
        };
    fs.writeFile("./coins.json", JSON.stringify(coins), (err) =>{
        if (err) console.log(err)
    });
    } 

    if(cmd === `${prefix}balance`){
        if(!coins[message.author.id]){
            coins[message.author.id] = {
                coins: 0
            };
        }

        let uCoins = coins[message.author.id].coins;

        let coinEmbed = new Discord.RichEmbed()
        .setTitle("Balance")
        .setAuthor(message.author.username)
        .setColor("#f0000")
        .addField(":moneybag:", uCoins);

        message.channel.send(coinEmbed);
    }
      
    let xpAdd = Math.floor(Math.random() * 7) + 8;
    console.log(`${message.author.username} has gained`, xpAdd, "xp" );
  
    if(!xp[message.author.id]){
      xp[message.author.id] = {
        xp: 0,
        level: 1
      };
    }
  
  
    let curxp = xp[message.author.id].xp;
    let curlvl = xp[message.author.id].level;
    let nxtLvl = xp[message.author.id].level * 400;
    xp[message.author.id].xp =  curxp + xpAdd;
    if(nxtLvl <= xp[message.author.id].xp){
      xp[message.author.id].level = curlvl + 1;
      console.log(`${message.author.username} has leveled up to` , curlvl + 1);
      let lvlup = new Discord.RichEmbed()
      .setTitle(`Level Up!`, `${message.author.username}`)
      .setColor("#f00000")
      .addField("New Level", curlvl + 1);
  
      message.channel.send(lvlup);
    }
    fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
      if(err) console.log(err)
    });


    if(cmd === `${prefix}ban`){
        
        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!bUser) return message.channel.send("Can't find user! Please specify one.");
        if(bUser.id === message.author.id){
            return message.reply("You cannot ban yourself!");
        }
        let bReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("BAN_MEMBERS", "KICK_MEMBERS")) return message.channel.send("You don't have enough permission.")
        if(bUser.hasPermission("BAN_MEMBERS", "KICK_MEMBERS")) return message.channel.send("xd");

        message.guild.member(bUser).ban(bReason); 
        return;
    }
    
    if(cmd ===`${prefix}rank`){
        if(!xp[message.author.id]){
            xp[message.author.id] = {
              xp: 0,
              level: 1
           };
         }
           let curxp = xp[message.author.id].xp;
           let curlvl = xp[message.author.id].level;
           let nxtLvlXp = curlvl * 400;
           let difference = nxtLvlXp - curxp;
         
           let lvlEmbed = new Discord.RichEmbed()
           .setAuthor(message.author.username)
           .setColor("#f00000")
           .addField("Level", curlvl, true)
           .addField("XP", curxp, true)
           .setFooter(`${difference} XP til level up`, message.author.displayAvatarURL);
         
           message.channel.send(lvlEmbed); 
    }

    if(cmd === `${prefix}pay`){
        let coins = require("./coins.json");
        if(!coins[message.author.id]){
            return message.reply("You don't have any coins!")
          }
        
          let pUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[1]);
          if(!pUser) message.channel.send("Please specify a user! And please do make sure that you have no extra spaces! If you made a mistake on the spacing, your coins will turn null!");
          if(!coins[pUser.id]){
            coins[pUser.id] = {
              coins: 0
            };
          }
          if(pUser.id === message.author.id){
            return message.reply("Cant send coins to yourself!");
        }
          let pCoins = coins[pUser.id].coins;
          let sCoins = coins[message.author.id].coins;
          
        
          if(sCoins < parseInt(args[1]) && parseInt(args[1]) > 0 && parseInt(args[1])) return message.reply("Not enough coins there!");
        
          coins[messge.author.id] = {
            coins: sCoins - parseInt(args[1])
          };
        
          coins[pUser.id] = {
            coins: pCoins + parseInt(args[1])
          };
        
          message.channel.send(`${message.author} has given ${pUser} ${args[1]} coins.`);
        
          fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
            if(err) cosole.log(err)
          });
    }


 

    if(cmd === `${prefix}report`){
        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if (!rUser) return message.channel.send("Couldn't find user.");
        let reason = args.join(" ").slice(22);
        if(pUser.id === message.author.id){
            return message.reply("You cannot report yourself!");
        }
        if (!reason) return message.channel.send("Correct usage: ``,report <user> <reason>``");
        let reportEmbed = new Discord.RichEmbed()
        .setColor("#15f153")
        .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
        .addField("Reported By", `${message.author}`)
        .addField("Channel", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason", `${reason}`); 
        let reportschannel = message.guild.channels.find(`name`, "logs");
        console.log(`${message.author.username}has reported ${rUser.id} Reason: ${reason} Time: ${message.createdAt}`);

        message.delete().catch(O_o=>{});
        reportschannel.send(reportEmbed);
        return message.channel.send("Thank you for reporting!")
    }

    if(cmd === `${customprefix1}nibba`){
        return message.channel.send(`${message.author} this the real nibba`);
    }

    if(cmd === `${prefix}8ball`){
        if(!args[0]) return message.channel.send("Please specify a question. Example: ``,8ball Nanay mo ba panot?``.");
        let replies = ["Yes, of course!", "Doubtful.", "Probabbly?","Ask again later.", "What a question.", "No."];
        let result = Math.floor((Math.random() * replies.length));
        let question = args.slice(" ")

        message.channel.send(replies[result]);
    }

    if(cmd === `${prefix}coinflip`){
        let ht = ["You got tails!", "You got heads!"];
        let htort = Math.floor((Math.random() *ht.length));
        message.channel.send(ht[htort]);
    }

    if(cmd === `${prefix}avatar`){
        let aUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!aUser) return message.reply("Please specify a user.");
        let aIcon = aUser.user.displayAvatarURL;
        let aEmbed = new Discord.RichEmbed()
        .setTitle(`${aUser}'s avatar`)
        .setImage(aIcon);
        message.channel.send(aEmbed);
    }
    

});
bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type ==="dm" )return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(cmd === `${prefix}help`){
        return message.channel.send(`${message.author}, visit this site for help! ->http://erinabot.000webhostapp.com/`);
    }
});
bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type ==="dm" )return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1)

    if (cmd === `${prefix}serverinfo`){
        
        let sicon = message.guild.displayAvatarURL;
        let serverembed = new Discord.RichEmbed()
        .setDescription("Server Info")
        .setColor("#15f153")
        .setThumbnail(sicon)
        .addField("Server Name", message.guild.name)
        .addField("Created On", message.guild.createdAt)
        .addField("You Joined", message.member.joinedAt)
        .addField("Total Memebrs", message.guild.memberCount);
         return message.channel.send(serverembed);
    }

    if(cmd === `${prefix}info`){
        let bicon = bot.user.displayAvatarURL;
        let botembed = new Discord.RichEmbed()
        .setColor("#15f153")
        .setThumbnail(bicon)
        .addField("Erina", "Your member-friendly bot.")
        .addField("Developer", "<@244335091361382400>")
        .addField("Version", "1.0.0 Stable")
        .addField("Website", "http://erinabot.000webhostapp.com/");
        
        return message.channel.send(botembed)
    }
});
    client.login(process.env.BOT_TOKEN);
    bot.login(botconfig.token);
