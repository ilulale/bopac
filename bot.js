require("dotenv").config(); //to start process from .env file
const logger = require("./winston");
const { Client, GatewayIntentBits, Events } = require("discord.js");
const handleAction = require("./actions");
const mongoose = require("mongoose");

let mongoUri = `mongodb://localhost:9091/bopacdb`;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", () => {
  logger.error("DB connection error.");
});
db.once("open", function () {
  logger.info(`Connected to db : ${mongoUri}`);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});
client.once("ready", () => {
  logger.info("Bopac is alive!");
  sendOnLogChannel(`I am alive!`);
});

const sendOnLogChannel = (message) => {
  client.channels.cache.get("1043947692377768026").send(message);
};

client.on("messageCreate", function (message) {
  if (message.author.bot) return;
  else {
    logger.debug(message);
    handleAction(message, client);
  }
});

client.login(process.env.TOKEN);
