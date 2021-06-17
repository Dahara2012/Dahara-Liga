//jQuery ready-Event
$(document).ready(function() {
    generateSoloStandings();
    generateTeamStandings();
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

function getTeamStandings() {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "teamStandings"
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
        //PP Farbe
        let pp = soloStandingsEntries.pp;
        if (pp == null || parseInt(pp) < 0){pp = 0;}
        if (parseInt(pp) >= 10){
            pp = "<span class='badge bg-danger'>"+pp+"</span>";
        }else if(parseInt(pp) < 4){
            pp = "<span class='badge bg-success'>"+pp+"</span>";
        }else if(parseInt(pp) >= 4){
            pp = "<span class='badge bg-warning text-dark'>"+pp+"</span>";
        }
        //Check Avatar = NULL
        let avatarurl = 'img/platzhalter.png';
        if (soloStandingsEntries[i].avatarurl != null){
            avatarurl = soloStandingsEntries[i].avatarurl;
        }
        //Replace Template
        template = await getTemplate('standings_solo.html');
        template = template.replace("ajaxPos", i+1);
        template = template.replace("ajaxAvatar", "<img src='"+avatarurl+"' class='img-fluid' style='max-height: 1cm;'>");
        template = template.replace("ajaxFahrer", soloStandingsEntries[i].username);
        template = template.replace("ajaxTeam", soloStandingsEntries[i].teamname);
        template = template.replace("ajaxPunkte", soloStandingsEntries[i].gesamtpunkte);
        template = template.replace("ajaxPP", pp);
        $('#soloStandings').append(template);
    }
}

async function generateTeamStandings() {
    let teamStandingsEntries = await getTeamStandings();
    for (let i = 0; i < teamStandingsEntries.length; i++) {
        let pp = '';
        if (parseInt(teamStandingsEntries[i].pp) >= 15){
            pp = "<span class='badge bg-danger'>"+teamStandingsEntries[i].pp+"</span>";
        }else if(parseInt(teamStandingsEntries[i].pp) < 5){
            pp = "<span class='badge bg-success'>"+teamStandingsEntries[i].pp+"</span>";
        }else if(parseInt(teamStandingsEntries[i].pp) >= 5){
            pp = "<span class='badge bg-warning text-dark'>"+teamStandingsEntries[i].pp+"</span>";
        }else if(teamStandingsEntries[i].pp === null){
            pp = "<span class='badge bg-success'>0</span>";
        }
        template = await getTemplate('standings_team.html');
        template = template.replace("ajaxPos", i+1);
        template = template.replace("ajaxTeam", "<a href='index.html?page=team&id="+teamStandingsEntries[i].id+"' target='_self'>"+teamStandingsEntries[i].name+"</a>");
        template = template.replace("ajaxPunkte", teamStandingsEntries[i].punkte);
        template = template.replace("ajaxPP", pp);
        $('#teamStandings').append(template);
    }
}