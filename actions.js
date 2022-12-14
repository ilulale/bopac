const exec = require("child_process").exec;
const Task = require("./models/task");
const logger = require("./winston");
const handleAction = (message, client) => {
  const sendOnLogChannel = (message) => {
    client.channels.cache.get("1043947692377768026").send(message);
  };

  const handleReply = (replyObj, msg) => {
    if ("channel" in replyObj) {
      msg.channel.send(replyObj["channel"]);
    }
    if ("reply" in replyObj) {
      msg.reply(replyObj["reply"]);
    }
    if ("dm" in replyObj) {
      logger.info("Entered dm");
      msg.member.send(replyObj["dm"]);
    }
    if ("log" in replyObj) {
      sendOnLogChannel(replyObj["log"]);
    }
  };

  let masterPath = process.cwd();
  let replyObj = {};
  let msg = message.content;

  if (message.content.toLocaleLowerCase() === "hello") {
    replyObj["log"] = "[Issued] Greet Command by " + message.author.username;
    replyObj["channel"] = `Hello! @${message.author.username}`;
    handleReply(replyObj, message);
  }

  if (msg.startsWith("!task create")) {
    let taskName = msg.split(" ");
    taskName = taskName.slice(2).join(" ");
    // const task = Task.find({});
    const task = new Task({
      task: taskName,
      status: "created",
      tags: [],
      createdAt: Date.now(),
    });
    task.save();
    let replyObj = {};
    replyObj["reply"] = `[TASK] ${taskName} : created successfully.`;
    handleReply(replyObj, message);
  }

  if (msg.startsWith("!task ls")) {
    let cmd = msg.split(" ");
    cmd = cmd.slice(2).join(" ");
    if (!cmd) {
      Task.find({}).then((tasks) => {
        let replyObj = {};
        let tmpreply = tasks.map((task) => `${task.task}\n`);
        replyObj["reply"] = tmpreply.toString();
        handleReply(replyObj, message);
      });
    }
  }

  // if (message.content.toLocaleLowerCase() === "!master ls") {
  //   replyObj["log"] = "[Issued] ls command";
  //   exec(`cd ${masterPath} && ls `, function (error, stdout, stderr) {
  //     replyObj["reply"] = "Check your dms for execution";
  //     replyObj["dm"] = "[stdout >] \n" + stdout + "\n";
  //     if (stderr) {
  //       replyObj["dm"] = replyObj["dm"] + "[stderror >] \n" + stderr + "\n";
  //     }
  //     replyObj["dm"] = replyObj["dm"] + "--??????--";

  //     if (error !== null) {
  //       logger.error(error);
  //     }
  //     handleReply(replyObj, message);
  //   });
  // }

  // if (message.content.startsWith("!master exec")) {
  //   let cmd = message.content.split(" ");
  //   cmd = cmd.slice(2);
  //   cmd = cmd.join(" ");
  //   logger.info(cmd);
  //   exec(cmd, function (err, stdout, stderr) {
  //     replyObj["dm"] = `Executing : ${cmd} \n`;
  //     replyObj["dm"] = replyObj["dm"] + "[stdout >]\n" + stdout + "\n";
  //     if (stderr) {
  //       replyObj["dm"] = replyObj["dm"] + "[stderr >]\n" + stderr + "\n";
  //     }
  //     replyObj["dm"] = replyObj["dm"] + "--??????--";
  //     if (err !== null) {
  //       logger.error(err);
  //     }
  //     handleReply(replyObj, message);
  //   });
  // }

  // if (message.content.toLocaleLowerCase() === "!master update") {
  //   replyObj["log"] = "[Issued] update command : " + message.author.username;
  //   exec(`cd ${masterPath} && git pull`, function (error, stdout, stderr) {
  //     replyObj["reply"] = "Check your dms for execution";
  //     replyObj["dm"] = "[stdout >] \n" + stdout + "\n";
  //     if (stderr) {
  //       replyObj["dm"] = replyObj["dm"] + "[stderr >]\n" + stderr + "\n";
  //     }
  //     replyObj["dm"] = replyObj["dm"] + "--??????--";

  //     if (error !== null) {
  //       logger.error(error);
  //     }
  //     handleReply(replyObj, message);
  //     setTimeout(() => {
  //       logger.warn(`[Restart] Command Issued by ${message.author.username}`);
  //       process.exit(1);
  //     }, 5000);
  //   });
  // }
};

module.exports = handleAction;
