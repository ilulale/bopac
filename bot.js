require("dotenv").config(); //to start process from .env file
const fs =require('node:fs')
const path=require('node:path')
const logger = require("./winston")
const {Client, GatewayIntentBits, Collection, Events}=require("discord.js");
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
    

    if(message.content.toLocaleLowerCase()==='hello')
        sendOnLogChannel('[Issued] Greet Command by '+message.author.username)
        message.channel.send(`Hello! @${message.author.username}`)
}

client.on('messageCreate',
function (message){
    if(message.author.bot) return;
    else{
    logger.debug(message)
        handleAction(message)
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
