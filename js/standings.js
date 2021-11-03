//jQuery ready-Event
$(document).ready(async function () {
    const season = await determineSeason();
    console.log(season);
    generateSoloStandings(season);
    generateTeamStandings(season);
});

function getSoloStandings(season) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "soloStandings",
                id: season
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getTeamStandings(season) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "teamStandings",
                id: season
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

async function generateSoloStandings(season) {
    let soloStandingsEntries = await getSoloStandings(season);
    for (let i = 0; i < soloStandingsEntries.length; i++) {
        //Replace Template
        template = await getTemplate('standings_solo.html');
        template = template.replace("ajaxPos", i + 1);
        template = template.replace("ajaxFahrer", "<a href='index.html?page=profile&id=" + soloStandingsEntries[i].id + "' target='_self'>" +soloStandingsEntries[i].username+ "</a>");
        template = template.replace("ajaxTeam", soloStandingsEntries[i].teamname);
        template = template.replace("ajaxPunkte", soloStandingsEntries[i].gesamtpunkte);
        $('#soloStandings').append(template);
    }
}

async function generateTeamStandings(season) {
    let teamStandingsEntries = await getTeamStandings(season);
    for (let i = 0; i < teamStandingsEntries.length; i++) {
        template = await getTemplate('standings_team.html');
        template = template.replace("ajaxPos", i + 1);
        template = template.replace("ajaxLogo", "<img src='img/"+teamStandingsEntries[i].logo+"' class='img-fluid' style='max-height: 1cm; max-width:2cm; object-fit: cover;'>");
        template = template.replace("ajaxTeam", "<a href='index.html?page=team&id=" + teamStandingsEntries[i].id + "' target='_self'>" + teamStandingsEntries[i].name + "</a>");
        template = template.replace("ajaxPunkte", teamStandingsEntries[i].teampunkte);
        $('#teamStandings').append(template);
    }
}