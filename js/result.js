//jQuery ready-Event
$(document).ready(function () {
    let params = new URLSearchParams(document.location.search.substring(1));
    let id = params.get("id");
    if (!isNaN(id)) {
        generateResult(id);
    }
})

function getResult(id) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "result",
                id: id
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function generateResult(id) {
    resultEntries = await getResult(id);
    for (let i = 0; i < resultEntries.length; i++) {
        template = await getTemplate('result.html');
        template = template.replace("ajaxPos", resultEntries[i].position);
        template = template.replace("ajaxDriver", resultEntries[i].username);
        template = template.replace("ajaxTeam", resultEntries[i].teamname);
        template = template.replace("ajaxCar", resultEntries[i].car);
        template = template.replace("ajaxGap", '+ '+formatLaptimes(resultEntries[i].gap));
        template = template.replace("ajaxQual", resultEntries[i].qualipos+' - '+formatLaptimes(resultEntries[i].quali));
        template = template.replace("ajaxFast", formatLaptimes(resultEntries[i].fastest));
        template = template.replace("ajaxPoints", resultEntries[i].points);
        $('#resultTable').append(template);
    }
}