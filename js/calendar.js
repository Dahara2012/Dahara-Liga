//jQuery ready-Event
$(document).ready(function() {
    generateCalendar();
})

function getCalendar() {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "race"
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function generateCalendar(){
    calendarEntries = await getCalendar();
    for (let i = 0; i < calendarEntries.length; i++) {
        template = await getTemplate('calendar.html');
        template = template.replace("ajaxID", calendarEntries[i].id);
        template = template.replace("ajaxImage", calendarEntries[i].image);
        template = template.replace("ajaxCircuit", calendarEntries[i].circuit);
        template = template.replace("ajaxLayout", calendarEntries[i].layout);
        template = template.replace("ajaxStart", calendarEntries[i].start);
        template = template.replace("ajaxResult", '<a href=index.html?page=result&id='+calendarEntries[i].id+'>Link</a>');
        template = template.replace("ajaxIncidents", '<a href=index.html?page=incidents&id='+calendarEntries[i].id+'>Link</a>');
        $('#calendarDiv').append(template);
    }
}