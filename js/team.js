//jQuery ready-Event
$(document).ready(function () {
    let params = new URLSearchParams(document.location.search.substring(1));
    let id = params.get("id");
    if (!isNaN(id)) {
        generateBasicTeamInfo(id);
        generateKader(id);
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

async function generateBasicTeamInfo(id) {
    let teamEntries = await getTeam(id);
    $('#team-name').text(teamEntries[0].name);
    $('#team-website').html('<a target="_blanc" href="'+teamEntries[0].website+'">'+teamEntries[0].website+'</a>');
    $('#team-logo').html('<img src="img/'+teamEntries[0].logo+'" style="max-height: 5cm; max-width: 100%; height: auto;display: block; margin-left: auto; margin-right: auto;">');
}

async function generateKader(id) {
    let kaderEntries = await getKader(id);
    for (let i = 0; i < kaderEntries.length; i++) {
        template = await getTemplate('team_kader.html');
        template = template.replace("ajaxName", kaderEntries[i].name);
        template = template.replace("ajaxAvatar", "<img src='"+kaderEntries[i].avatarurl+"' class='img-fluid' style='max-height: 1cm;'>");
        $('#team-kader').append(template);
    }
}