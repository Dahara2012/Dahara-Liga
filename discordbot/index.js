////Includes
const configDatabase = require('./config/db.json');
const configToken = require('./config/token.json');
const configServer = require('./config/server.json');
const Discord = require('discord.js');
const client = new Discord.Client();
let guild;
var mysql = require('mysql');

////Main
client.login(configToken.value);


////Funktionen
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
      supportBigNumbers: true,
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

function queryCheckLicense(connection, discordid) {
  //SQL Query um zu überprüfen ob ein Discorduser eine Lizenz hat
  return new Promise((resolve, reject) => {
    connection.query({
      sql: 'SELECT * FROM `user` WHERE `discord` = ?',
      values: [discordid]
    }, function (error, results, fields) {
      if (error != null) {
        reject(error);
      }
      resolve(results[0]);
    });
  });
}

async function dbCheckLicense(discordid) {
  //DB Anfrage um zu überprüfen ob ein Discorduser eine Lizenz hat
  return new Promise(async (resolve, reject) => {
    var connection = await connectDatabase();
    let doSQL = await queryCheckLicense(connection, discordid);
    connection.end();
    if (typeof doSQL !== 'undefined') {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}

async function checkLizenzRollen() {
  //"Lizenz" Rolle auf Discord
  const lizenzrolle = guild.roles.resolve('905399125619654706');

  //Schleife die durch alle Discorduser iteriert
  for (const member of guild.members.cache) {
    //überprüfen ob Discord user eine Lizenz in DB hat
    let licenseCheck = await dbCheckLicense(member[1].id);
    console.log("L:" + licenseCheck + " R:" + member[1].roles.cache.has('905399125619654706') + " -" + member[1].displayName);

    //Vergabe oder entzug basierend auf Lizenzcheck & ob User die Rolle bereits hat
    if (member[1].roles.cache.has('905399125619654706') === true && licenseCheck === false) {
      member[1].roles.remove(lizenzrolle);
    }
    if (member[1].roles.cache.has('905399125619654706') === false && licenseCheck === true) {
      member[1].roles.add(lizenzrolle);
    }
  }
}

function queryCheckSeasonRole(connection, discordid) {
  //SQL Query um zu überprüfen ob ein Discorduser eine Lizenz hat
  return new Promise((resolve, reject) => {
    connection.query({
      sql: 'SELECT * FROM `user` join teammember on teammember.userid = `user`.`id` join team on teammember.teamid = team.id where `user`.discord = ? and team.season = (select current_season from settings where pk = 1)',
      values: [discordid]
    }, function (error, results, fields) {
      if (error != null) {
        reject(error);
      }
      resolve(results[0]);
    });
  });
}

async function dbCheckSeasonRole(discordid) {
  //DB Anfrage um zu überprüfen ob ein Discorduser die Season rolle bekommen soll
  return new Promise(async (resolve, reject) => {
    var connection = await connectDatabase();
    let doSQL = await queryCheckSeasonRole(connection, discordid);
    connection.end();
    if (typeof doSQL !== 'undefined') {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}

function queryGetSeasonRole(connection) {
  //SQL Query um zu überprüfen ob ein Discorduser eine Lizenz hat
  return new Promise((resolve, reject) => {
    connection.query({
      sql: 'SELECT `discordseasonroleid` FROM `settings` WHERE `pk` = 1;',
      values: []
    }, function (error, results, fields) {
      if (error != null) {
        reject(error);
      }
      resolve(results[0].discordseasonroleid);
    });
  });
}

async function dbGetSeasonRole() {
  //DB Anfrage um die Discordid der Seasonrolle aus der DB zu bekommen
  return new Promise(async (resolve, reject) => {
    var connection = await connectDatabase();
    let doSQL = await queryGetSeasonRole(connection);
    connection.end();
    if (typeof doSQL !== 'undefined') {
      resolve(doSQL);
    } else {
      resolve(false);
    }
  });
}

async function checkSeasonRollen() {
  //"Season" Rolle auf Discord
  let seasonRolleId = await dbGetSeasonRole();
  const seasonRolle = guild.roles.resolve(seasonRolleId);
  //Schleife die durch alle Discorduser iteriert
  for (const member of guild.members.cache) {
    //überprüfen ob Discord user in einem Season X Team in DB ist
    let roleCheck = await dbCheckSeasonRole(member[1].id);
    console.log("L:" + roleCheck + " R:" + member[1].roles.cache.has(seasonRolleId) + " -" + member[1].displayName);

    //Vergabe oder entzug basierend auf roleCheck & ob User die Rolle bereits hat
    if (member[1].roles.cache.has(seasonRolleId) === true && roleCheck === false) {
      member[1].roles.remove(seasonRolle);
    }
    if (member[1].roles.cache.has(seasonRolleId) === false && roleCheck === true) {
      member[1].roles.add(seasonRolle);
    }
  }
}

function queryGetTeamRoles(connection) {
  //SQL Query um zu überprüfen ob ein Discorduser eine Lizenz hat
  return new Promise((resolve, reject) => {
    connection.query({
      sql: 'SELECT id, name, discordroleid FROM `team` WHERE `season` = (select current_season from settings where pk = 1)',
      values: []
    }, function (error, results, fields) {
      if (error != null) {
        reject(error);
      }
      resolve(results);
    });
  });
}

async function dbGetTeamRoles() {
  //DB Anfrage um die Discordid der Seasonrolle aus der DB zu bekommen
  return new Promise(async (resolve, reject) => {
    var connection = await connectDatabase();
    let doSQL = await queryGetTeamRoles(connection);
    connection.end();
    if (typeof doSQL !== 'undefined') {
      resolve(doSQL);
    } else {
      resolve(false);
    }
  });
}

function queryCheckTeamRole(connection, discordid, teamid) {
  //SQL Query um zu überprüfen ob ein Discorduser im angegeben Team ist
  return new Promise((resolve, reject) => {
    connection.query({
      sql: 'SELECT * FROM `user` join teammember on `user`.id = teammember.userid where `user`.discord = ? and teammember.teamid = ?;',
      values: [discordid, teamid]
    }, function (error, results, fields) {
      if (error != null) {
        reject(error);
      }
      resolve(results[0]);
    });
  });
}

async function dbCheckTeamRole(discordid, teamid) {
  //DB Anfrage um zu überprüfen ob ein Discorduser im Angefragten Team ist
  return new Promise(async (resolve, reject) => {
    var connection = await connectDatabase();
    let doSQL = await queryCheckTeamRole(connection, discordid, teamid);
    connection.end();
    if (typeof doSQL !== 'undefined') {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}

async function checkTeamRollen() {
  //"Team" Rollen auf Discord
  let TeamRoleIds = await dbGetTeamRoles();

  //Schleife für jedes Team-rolle
  for (let index = 0; index < TeamRoleIds.length; index++) {
    const rolle = TeamRoleIds[index];
    const teamRolle = guild.roles.resolve(rolle.discordroleid);

    //Schleife die durch alle Discorduser iteriert
    for (const member of guild.members.cache) {
      //überprüfen ob Discord user Team dieser Schleife ist in DB ist
      let roleCheck = await dbCheckTeamRole(member[1].id, rolle.id);
      console.log("L:" + roleCheck + " R:" + member[1].roles.cache.has(rolle.discordroleid) + " -" + member[1].displayName);

      //Vergabe oder entzug basierend auf roleCheck & ob User die Rolle bereits hat
      if (member[1].roles.cache.has(rolle.discordroleid) === true && roleCheck === false) {
        member[1].roles.remove(teamRolle);
      }
      if (member[1].roles.cache.has(rolle.discordroleid) === false && roleCheck === true) {
        member[1].roles.add(teamRolle);
      }
    }
  }

}
////Events

//Bot Ready Event
client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  guild = client.guilds.resolve(configServer.guild);
  console.log(await guild.members.fetch());
  checkLizenzRollen();
  checkSeasonRollen();
  checkTeamRollen();

});