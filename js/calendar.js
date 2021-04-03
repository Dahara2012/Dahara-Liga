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

function getTemplate(file) {
    return new Promise((resolve, reject) => {
        try {
            $.get('./template/'+file, function(data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function generateCalendar(){
    calendarEntries = await getCalendar();
    template = await getTemplate('calendar.html');
    for (let i = 0; i < calendarEntries.length; i++) {
        template = template.replace("ajaxID", calendarEntries[i].id);
        template = template.replace("ajaxImage", calendarEntries[i].image);
        template = template.replace("ajaxCircuit", calendarEntries[i].circuit);
        template = template.replace("ajaxLayout", calendarEntries[i].layout);
        template = template.replace("ajaxStart", calendarEntries[i].start);
        $('#calendarDiv').append(template);
    }
}