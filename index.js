const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
//--------assigne un prefix pour appeler une commande du bot
const prefix = "!";
const { MessageEmbed } = require("discord.js")		


client.on("message", function(message) {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;
	
	const commandBody = message.content.slice(prefix.length);
	const args = commandBody.split(" ");
	const command = args.shift().toLowerCase();
	
	//--------repond "pong" et affiche le temps que le bot a mis pour repondre		
	if (command === "ping") {
		
		//commence un compteur de ms a partir du moment ou on tape la commande "!ping"
		const timeTaken = Date.now() - message.createdTimestamp;
		//renvoie un msg avec le temps que le bot a mis pour repondre
		message.reply(`Pong! ce message a pris ${timeTaken}ms a etre envoyer.`);
	}

			//-------permet de calculer la somme des arguments que l'utilisateur a entrer dans la commande
	else if ( command === "sum" ) {
		
		//----- place les arguments de la commande dans un tableau et remplace toutes les "," part des "." pour calculer le resultat
		const numArgs = args.map(x => parseFloat(x.replace(",",".")));
		//----- calcule tout les arguments
		const sum = numArgs.reduce((counter, x ) => counter += x );
		//---- verifie s'il y a des arguments a la commande et si le resultat n'est pas "NaN" 
		if (numArgs.length ==  0 || isNaN(sum) == true) {
			message.reply("tu t'es trompé dans la syntax, la syntax exacte est :\n!sum 'valeur1' 'valeur2' ou plus...")
		} else {
			message.reply(`the sum of all the arguments you provided is ${sum}!`);
		}
	}
	
	else if ( command === "rand") {
		
		//-------prend un nombre entre 1 et 100 et s'il est en dessous de 50 le bot enverra un message different
		
		var rating = Math.floor(Math.random() * 100) + 1;
		
		//-------si le rand est en dessous de 50 il retourne un message perdant sinon un message gagnant
		if ( rating < 50 ) {
			message.reply(`T'es mauvais ta choppé le nombre ${rating}/100`);
		} else {
			message.reply(`GG ! tu a choppé le nombre ${rating}/100`);
		}
	}
	
	//cette command sert a reagir au msg envoyer part l'utilisateur et aussi a son propre msg
	else if(command === "react") {	
		
		//https://unicode.org/emoji/charts/full-emoji-list.html ----- ce lien sert a capturer les emotes deja présent sur discord part leurs unicode		
		message.reply(`me faite pas chier je test un truc avec les emoji !`).then(message => {
			message.react("👍");
			message.react("👎");
			message.react("<play:854299384022958100>");
			message.react( "🤢" );
		})
		message.react("<play:854299384022958100>");
	}
	
	else if (command === "test") {
		
		//test de commande
		let embed = new MessageEmbed()
		.setTitle("page qui peut defiler")
		.setDescription("blabla blablablablabl blablablablablablablablablablablablablabla\nblablablablablablablablablablablablablabla\nblablablablablablablablablablablablablabla\nblablablablablablablablablablablablablabla\nblablablablablablablablablablablablablabla\nblablablablablablablablablablablablablabla\nblablablablablablablablablablablablablabla\nblablablablablablablablablablablablablabla\nblablablablablablablablablablablablablabla\nblablablablablablablablablablablablablabla")
		
		.setColor("RANDOM")
		message.channel.send(embed).then(message => {
			message.react("⬅");
			message.react("➡");
		})
		// message.react('⬅').then(() => message.react('➡'));
		const filter = (reaction, user) => {
			return ['⬅', '➡'].includes(reaction.emoji.name) === message.author.id;
		};

		message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
    	.then(collected => {
        	const reaction = collected.first();

        	if (reaction.emoji.name === '⬅') {
            	message.reply('you reacted with a thumbs up.');
        	} else {
            	message.reply('you reacted with a thumbs down.');
        	}
    })

	}
		
		
		else if (command === "help") {
			
			//--------     liste toutes les commandes avec leurs description que le bot peut faire 
			//--------              pour permettre a l'utilisateur de mieux le comprendre 
			//-------- """"""a mettre sous forme de tableau pour faire plusieurs page de commande """"""""
			message.delete()
			message.author.send("https://tenor.com/view/dance-cute-baby-baby-girl-gif-12916909")		
			let embed = new MessageEmbed()
				.setTitle("Liste des commandes")
				.addFields(
					{name : '**!help**', value : "Te donne toutes les commande que ce bot peut faire." },
					{name : '**!ping**', value : "pong !" },
					{name : '**!sum**', value : "calcul les valeurs que tu lui donne." },
					{name : '**!rand**', value : "sort un nombre aléatoire entre 1 et 100." },
					{name : '**!react**', value : "reagi avec un emote a ton message et au sien." },
					{name : '**!test**', value : "test la commande en cours de developpement." },
					{name : '**!kiki**', value : "hommage a un ami qui c'est fait défoncer part son père"},
					{name : '**!tg**', value : "vaut mieux evite..." }
					)
					.setFooter("prout")
					.setColor("RANDOM")
					message.channel.send(embed)
				}
				
				//---- cette commande sert a ban l'utilisateur qui utilise la commande "tg"
				else if (command === "tg") {
					
					let member = message.mentions.members.first();
					
					//---- stock dans un tableau les differents messages disponible quand la personne tape la commande
					const tabmsg = ["c'est pas tres gentil 😢", "toi même ","t'es ban !"];
					//---- recupere un msg aléatoirement dans le tableau
					const randomMessage = tabmsg[Math.floor(Math.random() * tabmsg.length)];
					
					//---- envoie le msg et reagi avec un emote a son propre message
					message.reply(randomMessage).then(message=>{message.react("😤")});
					if (randomMessage === "t'es ban !") {
						
						//---- recupere celui qui a taper la commande part son id
						const target = message.guild.member(message.author.id);
						//---- ban la target
						target.ban().then((member) => {
							message.channel.send("cheh");
							message.channel.send(target.nickname+" est ban");
						}).catch(() => {
							message.channel.send("sorry je n'avais pas vu que c'etait vous...");
						})
						
						
						
						
					}
				}

				//cette commande sert de "profile" a un ami (commande qu'on m'a demander de faire)
				else if (command === "profile") {

					
					const attachment = new Discord
					.MessageAttachment('./public/kiki.png', 'kiki.png');
					
					//creation de la "div" et mise en page
					const embed = new Discord.MessageEmbed()
   					.setTitle('kelian hassaïni')
   					.attachFiles(attachment)
   					.setImage('attachment://kiki.png')
					.setDescription("futur mort de plusieurs coup de poignard donné part son père\n suite a l'annonce de son intégration a l'armée de terre")
					.setFooter("2001-2021");

					//envoie de la "div"
					message.channel.send({embed});
				}
				
				
				
				
				
				//exemple de embed pris sur internet (si besoin)
				
				// else if (command === "inter") {
				
				// 	let embed = new MessageEmbed()
				// 		.setTitle("This is a title")
				// 		.setTitle("http://tryitands.ee")
				// 		.setDescription("This is a description")
				// 		.setTimestamp()
				// 		.setFooter("This is a footer")
				// 		.setAuthor("prout","https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.publicdomainpictures.net%2Ffr%2Fview-image.php%3Fimage%3D316756%26picture%3Dimage-de-fond&psig=AOvVaw0OVMC5u3uoHIJan8qjgRF-&ust=1630136802083000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCLjh1vra0PICFQAAAAAdAAAAABAD")
				// 		.addField("This is a field", "this is its description")
				// 		.setImage("https://cdn.discordapp.com/avatars/449250687868469258/1709ab4f567c56eaa731518ff621747c.png?size=2048")
				// 		.setThumbnail("https://cdn.discordapp.com/avatars/449250687868469258/1709ab4f567c56eaa731518ff621747c.png?size=2048")
				// 	message.channel.send(embed);
				// }
				
				
				
			});
			
			
			
			
			
			
			
			
			
			client.login(config.BOT_TOKEN);
			