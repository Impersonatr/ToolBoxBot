console.log('[LOG] - starting server...');


var globalSettingsPath = './settings/settings.json';
var globalTimerPath = './timers'

//external modules
const fs = require('fs');
const path = require('path');
var Discord = require('discord.js');

// Initialize Discord client
const client = new Discord.Client();

//console.log('[DEBUG]');
//console.log('[MOD]');
//console.log('[LOG]');

//Initialize server settings from file
var settings;
reloadSettingsData();
console.log('[LOG] - After settings init');

client.on('ready', function (evt) {
    console.log('[LOG] - Connected');
    console.log('Logged in as: ' + client.user.tag);
    //console.log(client.user.tag);
});

//client.on('message', function (user, userID, channelID, message, evt) {
client.on('message', msg => {
	// Our client needs to know if it will execute a command
	// It will listen for messages that will start with `!`
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
			case 'change':
				var oldPrompt = settings.prompt;
				if(allArgs[1] != null) {
					fs.readFile(globalSettingsPath, 'utf8', function readFileCallback(err, data){
						if (err) { console.log(err); } 
						else {
							var obj = JSON.parse(data); //now it an object
							obj["prompt"] = allArgs[1];
							var json = JSON.stringify(obj); //now it json again
							
							fs.writeFile(globalSettingsPath, json, 'utf8', function callback(){
								reloadSettingsData();
								console.log('[MOD] - args changed from ' + oldPrompt + ' to ' + allArgs[1]);
								msg.reply('prompt changed to \'' + allArgs[1] + '\' !');
							}); //write back and callback
						}
					});
				}
				else {
					console.log('[MOD] - arg change attempted from ' + oldPrompt + ' to ' + allArgs[1]);
					msg.reply('prompt change failed. ' + allArgs[1] + 'is invalid.');
				}
				break;
			case 'help':
				msg.channel.send('Valid commands include:\n' +
					"   - ping\n" +
					"   - pingme\n" +
					"   - change\n"
				);
				break;
			default:
				msg.reply('Unrecognized command');
				msg.channel.send('Valid commands include:\n' +
					"   - ping\n" +
					"   - pingme\n" +
					"   - change\n"
				);
		}
	}
});

client.login('NTg0NDY1NTIzMDM5Nzk3MjU4.XPLbJw.hqryz-U7rJlU_quatHNYLobBCac');


//functions
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