//Includes
const configDatabase = require('./config/db.json');
const configToken = require('./config/token.json');
const configServer = require('./config/server.json');
const Discord = require('discord.js');
const client = new Discord.Client();
var mysql = require('mysql');

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

async function dbSavePresence(oldPresence, newPresence) {
  try {
    var connection = await connectDatabase();
    let doSQL = await querySavePresence(connection, oldPresence, newPresence);
    connection.end();
  } catch (error) {
    if (typeof connection !== 'undefined') {
      connection.end();
    }
    console.log(error);
    return false
  }
}

function querySavePresence(connection, oldPresence, newPresence) {
  //Aktualisiert oder legt UserData eines Nutzers in der DB neu an
  return new Promise((resolve, reject) => {
    let avatar = newPresence.member.user.avatarURL({ format: "png", dynamic: true, size: 4096 });
    if (avatar == null) {
      avatar = 'https://liga.dahara.de/img/platzhalter.jpg';
    }
    let userid = newPresence.userID;
    let time = getTime();
    let nickname = 'Name';
    if (newPresence.user.username != null) {
      nickname = newPresence.user.username;
    }
    if (newPresence.member.nickname != null) {
      nickname = newPresence.member.nickname;
    }
    connection.query({
      sql: 'INSERT INTO `discord`(`discordid`, `avatarurl`, `nickname`) VALUES (?,?,?) ON DUPLICATE KEY UPDATE `avatarurl`=?, `nickname`=?',
      values: [userid, avatar, nickname, avatar, nickname]
    }, function (error, results, fields) {
      if (error != null) {
        reject(error);
      }
      resolve(time + " UserData updated for " + nickname);
    });
  });
}

//Events
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
  let time = getTime();
  let nickname = 'Name';
  if (newPresence.user.username != null) {
    nickname = newPresence.user.username;
  }
  if (newPresence.member.nickname != null) {
    nickname = newPresence.member.nickname;
  }
  console.log(time + " Event: Presence-Update " + nickname)

  let log = dbSavePresence(oldPresence, newPresence);
});