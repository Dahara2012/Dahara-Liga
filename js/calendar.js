//jQuery ready-Event
$(document).ready(async function () {
    const season = await determineSeason();
    generateCalendar(season);
});

function getCalendar(season) {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "race",
                id: season
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function generateCalendar(season) {
    calendarEntries = await getCalendar(season);
    for (let i = 0; i < calendarEntries.length; i++) {
        template = await getTemplate('calendar.html');
        template = template.replace("ajaxID", calendarEntries[i].id);
        template = template.replace("ajaxImage", calendarEntries[i].image);
        template = template.replace("ajaxCircuit", calendarEntries[i].circuit);
        template = template.replace("ajaxLayout", calendarEntries[i].layout);
        template = template.replace("ajaxStart", calendarEntries[i].start);
        template = template.replace("ajaxResult", 'index.html?page=result&id=' + calendarEntries[i].id);
        template = template.replace("ajaxIncidents", 'index.html?page=incidents&id=' + calendarEntries[i].id);
        $('#calendarDiv').append(template);
    }
}