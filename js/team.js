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
    $('#team-website').html('<a target="_blanc" href="' + teamEntries[0].website + '">' + teamEntries[0].website + '</a>');
    $('#team-logo').html('<img src="img/' + teamEntries[0].logo + '" style="max-height: 5cm; max-width: 100%; height: auto;display: block; margin-left: auto; margin-right: auto;">');
}

async function generateKader(id) {
    let kaderEntries = await getKader(id);
    for (let i = 0; i < kaderEntries.length; i++) {
        template = await getTemplate('team_kader.html');
        template = template.replace("ajaxName", "<a href='index.html?page=profile&id=" + kaderEntries[i].userid + "'>" + kaderEntries[i].username + "</a>");
        $('#team-kader').append(template);
    }
}

async function generateTeamResults(id) {
    let TeamResultsEntries = await getTeamResults(id);
    for (let i = 0; i < TeamResultsEntries.length; i++) {
        template = await getTemplate('team_results.html');
        template = template.replace("ajaxID", TeamResultsEntries[i].id);
        template = template.replace("ajaxCircuit", TeamResultsEntries[i].circuit);
        template = template.replace("ajaxPunkte", TeamResultsEntries[i].punkte);
        $('#team-results').append(template);
    }
}

async function generateTeamStrafpunkte(id) {
    let penaltyEntries = await getTeamIncidents(id);
    let ppsum = 0;
    for (let i = 0; i < penaltyEntries.length; i++) {
        template = await getTemplate('team_penalties.html');
        template = template.replace("ajaxID", penaltyEntries[i].race);
        template = template.replace("ajaxVerfall", penaltyEntries[i].verfall);
        template = template.replace("ajaxPP", penaltyEntries[i].pp);
        ppsum = ppsum + penaltyEntries[i].pp;
        $('#team-penalties').append(template);
    }

    let ppEntry = await getDriverPenalties(id);
    for (let k = 0; k < ppEntry.length;  k++) {
        template2 = await getTemplate('team_penalties.html');
        template2 = template2.replace("ajaxID", ppEntry[k].race);
        template2 = template2.replace("ajaxVerfall", ppEntry[k].verfall);
        template2 = template2.replace("ajaxPP", ppEntry[k].pp);
        ppsum = ppsum + ppEntry[k].pp;
        $('#team-penalties').append(template2);
    }

    let ppsummeneintrag = '<p class="list-group-item d-flex justify-content-between align-items-center">Aktuelle Anzahl Strafpunkte: <span class="badge bg-dark rounded-pill">' + ppsum + '</span></p>';
    $('#team-penalties').append(ppsummeneintrag);
}