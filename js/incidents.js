//jQuery ready-Event
$(document).ready(function () {
    let params = new URLSearchParams(document.location.search.substring(1));
    let id = params.get("id");
    if (!isNaN(id)) {
        generateIncidents(id);
    }
});

function getIncidents(id) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "incidents",
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
                objekt: "teamincidents",
                id: id
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function generateIncidents(id) {
    penaltyEntries = await getIncidents(id);
    penaltyTeamEntries = await getTeamIncidents(id);
    for (let i = 0; i < penaltyEntries.length; i++) {
        template = await getTemplate('incidents.html');
        template = template.replace("ajaxFahrer", penaltyEntries[i].fahrername);
        template = template.replace("ajaxTeam", penaltyEntries[i].teamname);
        template = template.replace("ajaxBeschreibung", penaltyEntries[i].description);
        template = template.replace("ajaxWo", penaltyEntries[i].wo);
        template = template.replace("ajaxStrafpunkte", penaltyEntries[i].strafe);
        $('#incidentTable').append(template);
    }
    for (let i = 0; i < penaltyTeamEntries.length; i++) {
        template = await getTemplate('incidents.html');
        template = template.replace("ajaxFahrer", '-');
        template = template.replace("ajaxTeam", penaltyTeamEntries[i].teamname);
        template = template.replace("ajaxBeschreibung", penaltyTeamEntries[i].description);
        template = template.replace("ajaxWo", penaltyTeamEntries[i].wo);
        template = template.replace("ajaxStrafpunkte", penaltyTeamEntries[i].strafe);
        $('#incidentTable').append(template);
    }
}