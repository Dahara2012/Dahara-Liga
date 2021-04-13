//jQuery ready-Event
$(document).ready(function() {
    generateParticipants();
    generateDiscordOnly();
})

function getParticipants() {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "participants"
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getDiscordOnlyAccounts() {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "discordonly"
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getOnlyDiscord() {
    
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "discordonly"
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function generateParticipants() {
    let participantsEntries = await getParticipants();
    for (let i = 0; i < participantsEntries.length; i++) {
        template = await getTemplate('participants1.html');
        template = template.replace("ajaxFahrer", participantsEntries[i].driver);
        template = template.replace("ajaxTeam", participantsEntries[i].team);
        template = template.replace("ajaxIRacing", "<a target='_blanc' href='https://members.iracing.com/membersite/member/CareerStats.do?custid="+participantsEntries[i].iracingid+"'>"+participantsEntries[i].iracingid+"</a>");
        $('#participantsTable').append(template);
    }
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function generateDiscordOnly() {
    let discordOnlyEntries = await getOnlyDiscord();
    for (let i = 0; i < discordOnlyEntries.length; i++) {
        template = await getTemplate('participants2.html');
        template = template.replace("ajaxAvatar", discordOnlyEntries[i].avatarurl);
        template = template.replace("ajaxName", htmlEntities(discordOnlyEntries[i].nickname));
        $('#discordOnly').append(template);
    }
}