require("dotenv").config(); //to start process from .env file
const fs =require('node:fs')
const path=require('node:path')
const logger = require("./winston")
const {Client, GatewayIntentBits, Collection, Events}=require("discord.js");
const {syncBuiltinESMExports} = require("node:module");
const exec = require('child_process').exec
const client=new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
});
client.once("ready", () =>{
    logger.info("Bopac is alive!")
    sendOnLogChannel(`I am alive!`)
})

client.commands = new Collection()
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
            logger.debug(`Successfully set ${command.data.name} to commands`)
	} else {
		logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


const sendOnLogChannel = (message) =>{
    client.channels.cache.get('1043947692377768026').send(message)
}

const handleAction=(message)=>{
    
    let masterPath = process.cwd()    
    let replyObj = {}

    if(message.content.toLocaleLowerCase()==='hello'){
        replyObj['log']= '[Issued] Greet Command by '+message.author.username
        replyObj['channel'] = `Hello! @${message.author.username}`

    if(message.content.toLocaleLowerCase()==='!master ls'){
        replyObj['log'] = '[Issued] ls command'
        exec(`cd ${masterPath} && ls `,
    function (error, stdout, stderr) {
        replyObj['reply'] = 'Check your dms for execution'
        replyObj['dm'] = '[stdout >] \n'+stdout+'\n'
        if(stderr){
            replyObj['dm'] = replyObj['dm'] + '[stderror >] \n'+stderr+'\n'
        }
        replyObj['dm'] = replyObj['dm'] + '--❌❌--'

        if (error !== null) {
            logger.error(error)
        }
    });
    }


    if(message.content.toLocaleLowerCase()==='!master update'){
        replyObj['log'] = '[Issued] update command : '+message.author.username
        exec(`cd ${masterPath} && git pull`,
    function (error, stdout, stderr) {
        replyObj['reply']='Check your dms for execution'
        replyObj['dm']='[stdout >] \n'+stdout+'\n'
        if(stderr){
            replyObj['dm']= replyObj['dm']+'[stderr >]\n'+stderr+'\n'
        }
        replyObj['dm'] = replyObj['dm']+'--❌❌--'

        if (error !== null) {
            logger.error(error)
        }
        setTimeout(()=>{
            logger.warn(`[Restart] Command Issued by ${message.author.username}`)
            process.exit(1)
        },5000)
    });
    }

    return replyObj
}

client.on('messageCreate',
function (message){
    if(message.author.bot) return;
    else{
    logger.debug(message)
        let replyObj = handleAction(message)
        if(replyObj['channel']){
            message.channel.send(replyObj['channel'])
        }
        if(replyObj['reply']){
            message.reply(replyObj['reply'])
        }
        if(replyObj['dm']){
            message.member.send(replyObj['dm'])
        }
        if(replyObj['log']){
            sendOnLogChannel(replyObj['log'])
        }
}}
)

client.on(Events.InteractionCreate,async interaction =>{
    if(!interaction.isChatInputCommand()) return 
    logger.debug(interaction)
    const command = interaction.client.commands.get(interaction.commandName)

    if(!command){
        logger.error(`No command matching ${interaction.commandName} was found`)
    }

    try{
        await command.execute(interaction)
    }catch(error){
        logger.error(error)
        await interaction.reply({
            content : 'There was a error executing this command',
            ephemeral:true
        })
    }
})

client.login(process.env.TOKEN);
