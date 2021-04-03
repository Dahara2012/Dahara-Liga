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
                console.log(data);
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
        template = template.replace("ajaxGap", resultEntries[i].gap);
        template = template.replace("ajaxQual", resultEntries[i].qualipos);
        template = template.replace("ajaxAvg", resultEntries[i].average);
        template = template.replace("ajaxFast", resultEntries[i].fastest);
        template = template.replace("ajaxInc", resultEntries[i].incidents);
        $('#resultTable').append(template);
    }
}