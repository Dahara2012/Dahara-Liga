//jQuery ready-Event
$(document).ready(function () {
    let params = new URLSearchParams(document.location.search.substring(1));
    let id = params.get("id");
    if (!isNaN(id)) {
        generateProfile(id);
    }
});

function getProfile(id) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "userTeam",
                id: id
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getPodiums(id) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "podiums",
                id: id
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getFahrerGesamtPunkte(id) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "fahrerGesamtPunkte",
                id: id
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getCurrentGesamtStrafpunkte(id) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "currentGesamtStrafpunkte",
                id: id
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getCurrentStrafpunkteListe(id) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "currentStrafpunkteListe",
                id: id
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getLastRacesListe(id) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "lastRacesListe",
                id: id
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getTeamKollegen(id) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "getTeamKollegen",
                id: id
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function generateProfile(id) {
    let [template, resultEntries1, resultEntries2, resultEntries3, resultEntries4, resultEntries5, resultEntries6, resultEntries7] = await Promise.all([getTemplate('profile.html'), getProfile(id), getPodiums(id), getFahrerGesamtPunkte(id), getCurrentGesamtStrafpunkte(id), getCurrentStrafpunkteListe(id), getLastRacesListe(id), getTeamKollegen(id)]);
    template = template.replace("ajaxName", resultEntries1[0].username);
    template = template.replace("ajaxTeam1", resultEntries1[0].teamname);
    template = template.replace("ajaxTeam2", resultEntries1[0].teamname);
    template = template.replace("ajaxBild", resultEntries1[0].logo);
    template = template.replace("ajaxPodiums", resultEntries2[0].podiums);
    template = template.replace("ajaxPoints", resultEntries3[0].punkte);
    template = template.replace("ajaxPPoints", resultEntries4[0].aktuelleStrafpunkte);
    await $('#profile').append(template);
    let sumpp = 0;
    for (let i = 0; i < resultEntries5.length; i++) {
        let listeneintrag = '<a href="index.html?page=incidents&id=' + resultEntries5[i].race + '" class="list-group-item"><span class="badge bg-dark rounded-pill">bis ' + resultEntries5[i].verfall + '</span> ' + resultEntries5[i].pp + ' Strafpunkt(e)</a>';
        sumpp = sumpp + resultEntries5[i].pp;
        $('#strafpunkteliste').append(listeneintrag);
    }
    let ppsummeneintrag = '<p class="list-group-item d-flex justify-content-between align-items-center">Aktuelle Anzahl Strafpunkte: <span class="badge bg-dark rounded-pill">' + sumpp + '</span></p>';
    $('#strafpunkteliste').append(ppsummeneintrag);

    for (let i = 0; i < resultEntries6.length; i++) {
        let listeneintrag = '<a href="index.html?page=result&id=' + resultEntries6[i].race + '" class="list-group-item"><span class="badge bg-dark rounded-pill">Platz ' + resultEntries6[i].position + '</span> ' + resultEntries6[i].circuit + '</a>';
        $('#rennenliste').append(listeneintrag);
    }

    for (let i = 0; i < resultEntries7.length; i++) {
        if (resultEntries7[i].userid != id) {
            let listeneintrag = '<a href="index.html?page=profile&id=' + resultEntries7[i].userid + '" class="list-group-item">' + resultEntries7[i].username + '</a>';
            $('#teamkollegenliste').append(listeneintrag);
        }
    }
}