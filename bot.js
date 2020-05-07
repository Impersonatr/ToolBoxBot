/***************************************
* ToolBoxBot
* by Nick Newell
****************************************/
const globalSettingsPath = './settings/settings.json';
const globalTimerPath = './timers';
const globalLogPath = './settings/ToolBoxBot.log'
const version = "1.3.0";
var settings = {};

console.log('[LOG] - starting server...');

//external modules
const fs = require('fs');
const path = require('path');
var Discord = require('discord.js');
var Key = require('./settings/key.json');

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


client.login(Key.key);




//client.on logging
client.on('debug', function (evt) {
    fs.appendFile(globalLogPath, '\n\n--' + getDateFormatted('now') + ': Debug\n' + evt, function (err) {
		if (err) { console.log("[LOG] - Error writing DEBUG event to log"); };
	});
});

client.on('warn', function (evt) {
    fs.appendFile(globalLogPath, '\n\n--' + getDateFormatted('now') + ': Warn\n' + evt, function (err) {
		if (err) { console.log("[LOG] - Error writing WARN event to log"); };
	});
});

client.on('error', function (evt) {
    fs.appendFile(globalLogPath, '\n\n--' + getDateFormatted('now') + ': Error\n' + evt, function (err) {
		if (err) { console.log("[LOG] - Error writing ERROR event to log"); };
	});
});

client.on('disconnected', function (evt) {
    fs.appendFile(globalLogPath, '\n\n--' + getDateFormatted('now') + ': Disconnected\n' + evt, function (err) {
		if (err) { console.log("[LOG] - Error writing DISCONNECTED event to log"); };
	});
});

client.on('raw', function (evt) {
    fs.appendFile(globalLogPath, '\n\n--' + getDateFormatted('now') + ': Raw\n' + evt, function (err) {
		if (err) { console.log("[LOG] - Error writing RAW event to log"); };
	});
});

//functions
function init() {
	fs.writeFile(globalSettingsPath, "{}", { flag: 'wx' }, function (err) {
		if (err) { console.log("[INIT] - Settings file already exists"); };
		console.log("[INIT] - Settings file created");
	});
	
	fs.appendFile(globalLogPath, '\n\n--' + getDateFormatted('now') + ': STARTUP--\n\n', function (err) {
		if (err) { console.log("[INIT] - Error writing initial entry to log"); };
		console.log("[INIT] - Startup log entry written");
	});
	
	fs.readFile(globalSettingsPath, 'utf8', function readFileCallback(err, data){
		if (err) { console.log(err); } 
		else {
			data = JSON.parse(data);
			
			settings.version = version;
			settings.creator = data.creator || "Nick Newell";
			settings.prompt = data.prompt || "!";
			
			console.log('[INIT] - params set');
			
			fs.writeFile(globalSettingsPath, json, 'utf8', function callback(){ reloadSettingsData(); });
			
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

function getDateFormatted(when) {
	if (when == 'now') {
		var d = new Date(),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear(),
			hour = d.getHours(),
			minute = d.getMinutes();

		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;

		return [day, month, year, hour, minute].join('-');
	}
	else return "other dates not yet supported: " + when;
}

function keepAlive() {
	console.log('[LOG] - KeepAlive Active');
	
	//sleep?
}