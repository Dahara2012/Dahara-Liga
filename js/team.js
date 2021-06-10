//jQuery ready-Event
$(document).ready(function () {
    let params = new URLSearchParams(document.location.search.substring(1));
    let id = params.get("id");
    if (!isNaN(id)) {
        generateBasicTeamInfo(id);
        generateKader(id);
        generateTeamResults(id);
        generateTeamStrafpunkte(id);
    }
})

function getTeam(id) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "team",
                id: id
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getKader(id) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "kader",
                id: id
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getTeamResults(id) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "teamresults",
                id: id
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getDriverPenalties(id) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "driverPenalties",
                id: id
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getTeamIncidents(id) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "teamincidentsteampage",
                id: id
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function generateBasicTeamInfo(id) {
    let teamEntries = await getTeam(id);
    $('#team-name').text(teamEntries[0].name);
    $('#team-website').html('<a target="_blanc" href="'+teamEntries[0].website+'">'+teamEntries[0].website+'</a>');
    $('#team-logo').html('<img src="img/'+teamEntries[0].logo+'" style="max-height: 5cm; max-width: 100%; height: auto;display: block; margin-left: auto; margin-right: auto;">');
}

async function generateKader(id) {
    let kaderEntries = await getKader(id);
    for (let i = 0; i < kaderEntries.length; i++) {
        generateFahrerStrafpunkte(kaderEntries[i].name, kaderEntries[i].id);
        template = await getTemplate('team_kader.html');
        template = template.replace("ajaxName", kaderEntries[i].name);
        template = template.replace("ajaxAvatar", "<img src='"+kaderEntries[i].avatarurl+"' class='img-fluid' style='max-height: 1cm;'>");
        $('#team-kader').append(template);
    }
}

async function generateTeamResults(id) {
    let TeamResultsEntries = await getTeamResults(id);
    for (let i = 0; i < TeamResultsEntries.length; i++) {
        template = await getTemplate('team_results.html');
        template = template.replace("ajaxCar", "<img src='img/brands/"+TeamResultsEntries[i].car+".png' class='img-fluid' style='max-height: 1cm;'>");
        template = template.replace("ajaxPlatz", TeamResultsEntries[i].position+". Platz");
        template = template.replace("ajaxName", TeamResultsEntries[i].name+"</br>");
        template = template.replace("ajaxPoints", TeamResultsEntries[i].points+" Punkte in Rennen "+TeamResultsEntries[i].race);
        $('#team-results').append(template);
    }
}

async function generateFahrerStrafpunkte(name, id) {
    let ppEntry = await getDriverPenalties(id);
    let pp = ppEntry[0].strafpunkte;
    if (pp == null || parseInt(pp) < 0){pp = 0;}
    template = await getTemplate('team_penalties.html');
    template = template.replace("ajaxFahrer", name);
    template = template.replace("ajaxStrafpunkte", pp+" Strafpunkte");
    $('#team-penalties').append(template);
}

async function generateTeamStrafpunkte(id) {
    let penaltyEntries = await getTeamIncidents(id);
    console.log(penaltyEntries)
    for (let i = 0; i < penaltyEntries.length; i++) {
        template = await getTemplate('team_penalties.html');
        template = template.replace("ajaxFahrer", penaltyEntries[i].teamname);
        template = template.replace("ajaxStrafpunkte", penaltyEntries[i].strafe+" Strafpunkte "+penaltyEntries[i].description);
        $('#team-penalties').append(template);
    }
}