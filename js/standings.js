//jQuery ready-Event
$(document).ready(function() {
    generateSoloStandings();
})

function getSoloStandings() {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "soloStandings"
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

async function generateSoloStandings() {
    let soloStandingsEntries = await getSoloStandings();
    for (let i = 0; i < soloStandingsEntries.length; i++) {
        let ppEntry = await getDriverPenalties(soloStandingsEntries[i].userid);
        let pp = ppEntry[0].strafpunkte;
        if (pp == null){pp = 0;}
        if (parseInt(pp) >= 10){
            pp = "<span class='badge bg-danger'>"+pp+"</span>";
        }else if(parseInt(pp) < 4){
            pp = "<span class='badge bg-success'>"+pp+"</span>";
        }else if(parseInt(pp) >= 4){
            pp = "<span class='badge bg-warning text-dark'>"+pp+"</span>";
        }
        template = await getTemplate('standings_solo.html');
        template = template.replace("ajaxPos", i+1);
        template = template.replace("ajaxAvatar", "<img src='"+soloStandingsEntries[i].avatarurl+"' class='img-fluid' style='max-height: 1cm;'>");
        template = template.replace("ajaxFahrer", soloStandingsEntries[i].username);
        template = template.replace("ajaxTeam", soloStandingsEntries[i].teamname);
        template = template.replace("ajaxPunkte", soloStandingsEntries[i].gesamtpunkte);
        template = template.replace("ajaxPP", pp);
        $('#soloStandings').append(template);
    }
}