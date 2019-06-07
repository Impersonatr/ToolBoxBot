/***************************************
* ToolBoxBot
* by Nick Newell
****************************************/
const globalSettingsPath = './settings/settings.json';
const globalTimerPath = './timers';
const version = "1.1.0";
var settings = {};

console.log('[LOG] - starting server...');

//external modules
const fs = require('fs');
const path = require('path');
var Discord = require('discord.js');

// Initialize Discord client
const client = new Discord.Client();

//Initialize server settings from file
init();

//Useful console log headers:
//console.log('[DEBUG]');
//console.log('[MOD]');
//console.log('[LOG]');

client.on('ready', function (evt) {
    console.log('[LOG] - Connected');
    console.log('Logged in as: ' + client.user.tag);
});


client.on('message', msg => {
	//based on the command in settings.prompt:
	if (msg.content.substring(0, 1) == settings.prompt) {
		var args = msg.content.substring(1).split(' ');
		var allArgs = msg.content.split(' ');
		var cmd = args[0];

		args = args.splice(1);
		switch(cmd) {
			// !ping
			case 'ping':
				msg.channel.send('pong!');
				break;
			case 'pingme':
				msg.reply('pong you');
				break;
			case 'Rail':
				var epoch = 1559811600000;
				var magic = 1.03746397695;
				var start = new Date(epoch);
				var now = new Date;
				var diff = now - start;
				var newDate = new Date(epoch + (diff*magic));
				
				var incidentembed = new Discord.RichEmbed()
					.setTitle("Date and Time for Rail")
					//.setDescription("")
					.addField("The time is:", String(newDate), true)
					.setColor("#FFFFFF")
					.setTimestamp()
				
				msg.channel.send(incidentembed);
				break;
				
			case 'about':
				msg.channel.send('This bot was created by ' + settings.creator + '. It was intended as a test, initially. "Could I create a bot that could do X?" '
					+ 'He decided to expand on it, and thus ToolBoxBot was created.\n\n'
					+ 'If you have feature requests or suggestions, send them his way. He\'s always looking for a challenge.'
				);
				break;
			case 'change':
				var oldPrompt = settings.prompt;
				
				if((allArgs.length < 3) && (allArgs[1] != null)) {
					settings.prompt = allArgs[1];
					var json = JSON.stringify(settings);
					
					fs.writeFile(globalSettingsPath, json, 'utf8', function callback(){
						reloadSettingsData();
						console.log('[MOD] - args changed from ' + oldPrompt + ' to ' + allArgs[1]);
						msg.reply('prompt changed to \'' + allArgs[1] + '\' !');
					}); //write back and callback
				}
				else {
					console.log('[MOD] - arg change attempted: ' + oldPrompt + ' to ' + allArgs[1] + ', via ' + allArgs);
					msg.reply('prompt change failed. Input is invalid.');
				}
				break;
			case 'help':
				msg.channel.send('Valid commands include:\n' +
					"   - ping\n" +
					"   - pingme\n" +
					"   - about\n" +
					"   - change\n"
				);
				break;
			default:
				msg.reply('Unrecognized command');
				msg.channel.send('Valid commands include:\n' +
					"   - ping\n" +
					"   - pingme\n" +
					"   - about\n" +
					"   - change\n"
				);
		}
	}
});

client.login('NTg2NDIyOTI4ODQ2MDk0MzQ5.XPnzRg.WwqGIuOBzrluHwX4yGqhNhFpueA');




//functions
function init() {
	fs.readFile(globalSettingsPath, 'utf8', function readFileCallback(err, data){
		if (err) { console.log(err); } 
		else {
			data = JSON.parse(data);
			
			if(data.version == null) {
				settings.version = version;
				if(data.creator == null) { settings.creator = "Nick Newell"; }
				if(data.prompt  == null) { settings.prompt = "!"; }

				var json = JSON.stringify(settings);

				fs.writeFile(globalSettingsPath, json, 'utf8', function callback(){
					console.log('[MOD] - add default params');
					reloadSettingsData();
				}); //write back and callback
			}
			else {
				console.log('[LOG] - params already set');
				reloadSettingsData();
			}
		}
	});
}

function reloadSettingsData() {
	fs.readFile(globalSettingsPath, 'utf8', function readFileCallback(err, data){
		if (err) { console.log(err); } 
		else { 
			settings = JSON.parse(data);
			console.log('[MOD] - verify settings reload:');
			console.log(settings);
		}
	});
}