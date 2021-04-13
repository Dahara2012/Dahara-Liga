//Includes
const configDatabase = require('./config/db.json');
const configToken = require('./config/token.json');
const configServer = require('./config/server.json');
const Discord = require('discord.js');
const client = new Discord.Client();
var mysql = require('mysql');
var cooldown = new Date();

//Main
client.login(configToken.value);


//Funktionen
function getTime() {
  //Gibt aktuelle Zeit in Form hh:mm:ss für die Console zurück
  let now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  let s = now.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  return h + ":" + m + ":" + s;
}

function checkTime(i) {
  //Hilfsfunktion für führende Nullen für getTime()
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function connectDatabase() {
  //Stellt eine Datenbankverbindung her
  return new Promise((resolve, reject) => {
    let connection = mysql.createConnection({
      host: configDatabase.host,
      user: configDatabase.user,
      password: configDatabase.password,
      database: configDatabase.database,
      port: configDatabase.port,
      charset: 'utf8mb4_unicode_ci'
    });
    connection.connect(function (err) {
      if (err) {
        reject('error connecting: ' + err.stack);
      }
      else {
        resolve(connection);
      }
    });
  });
}

function selectLastChecked(connection) {
  return new Promise((resolve, reject) => {
    connection.query({
      sql: 'SELECT CAST(`discordid` AS CHAR) `discordid` FROM `discord` ORDER BY `discord`.`lastUpdate` ASC LIMIT 1'
    }, function (error, results, fields) {
      if (error != null) {
        reject(error);
      } else {
        resolve(results[0].discordid);
      }
    });
  });
}

function deleteLastChecked(connection, lastChecked) {
  return new Promise((resolve, reject) => {
    let time = getTime();
    connection.query({
      sql: 'DELETE FROM `discord` WHERE `discordid` = ?',
      values: [lastChecked]
    }, function (error, results, fields) {
      if (error != null) {
        reject(error);
      } else {
        console.log(time + " Deleted from Discord " + lastChecked);
        resolve();
      }
    });
  });
}

async function pruneKickedUsers() {
  try {
    var connection = await connectDatabase();
    let lastChecked = await selectLastChecked(connection);
    let guild = client.guilds.resolve(configServer.guild);
    let findUser = await guild.members.cache.get(lastChecked);
    if (typeof findUser === 'undefined') {
      let deleteKickedUser = await deleteLastChecked(connection, lastChecked);
    }else{
      let updateUser = await querySavePresence(connection, lastChecked);
    }
    connection.end();
  } catch (error) {
    console.log(error);
    if (typeof connection !== 'undefined') {
      connection.end();
    }
  }
}

async function dbSavePresence(discordid) {
  try {
    var connection = await connectDatabase();
    let doSQL = await querySavePresence(connection, discordid);
    connection.end();
  } catch (error) {
    if (typeof connection !== 'undefined') {
      connection.end();
    }
    console.log(error);
    return false
  }
}

function querySavePresence(connection, discordid) {
  //Aktualisiert oder legt UserData eines Nutzers in der DB neu an
  return new Promise((resolve, reject) => {
    let avatar = client.guilds.resolve(configServer.guild).members.cache.get(discordid).user.avatarURL({ format: "png", dynamic: true, size: 4096 });
    if (avatar == null) {
      avatar = 'https://liga.dahara.de/img/platzhalter.png';
    }
    let userid = discordid;
    let time = getTime();
    let nickname = 'Name';
    if (client.guilds.resolve(configServer.guild).members.cache.get(discordid).user.username != null) {
      nickname = client.guilds.resolve(configServer.guild).members.cache.get(discordid).user.username;
    }
    if (client.guilds.resolve(configServer.guild).members.cache.get(discordid).nickname != null) {
      nickname = client.guilds.resolve(configServer.guild).members.cache.get(discordid).nickname;
    }
    connection.query({
      sql: 'INSERT INTO `discord`(`discordid`, `avatarurl`, `nickname`) VALUES (?,?,?) ON DUPLICATE KEY UPDATE `avatarurl`=?, `nickname`=?, `LastUpdate`= CURRENT_TIMESTAMP',
      values: [userid, avatar, nickname, avatar, nickname]
    }, function (error, results, fields) {
      if (error != null) {
        reject(error);
      }
      console.log(time + " Discord data updated for " + nickname);
      resolve();
    });
  });
}

//Events
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
  let jetzt = new Date();
  if ((jetzt - cooldown) < 60000){
    dbSavePresence(newPresence.userID)
    console.log("wait for cooldown");
  }else{
    cooldown = jetzt;

    pruneKickedUsers();
  }
});