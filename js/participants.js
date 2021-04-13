//jQuery ready-Event
$(document).ready(function() {
    generateParticipants();
})

function getParticipants() {
    return new Promise((resolve, reject) => {
        try {
            $.getJSON('./api.php', {
                objekt: "participants"
            }, function (data) {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function generateParticipants() {
    let participantsEntries = await getParticipants();
    for (let i = 0; i < participantsEntries.length; i++) {
        template = await getTemplate('participants.html');
        template = template.replace("ajaxFahrer", participantsEntries[i].driver);
        template = template.replace("ajaxTeam", participantsEntries[i].team);
        template = template.replace("ajaxIRacing", "<a target='_blanc' href='https://members.iracing.com/membersite/member/CareerStats.do?custid="+participantsEntries[i].iracingid+"'>"+participantsEntries[i].iracingid+"</a>");
        $('#participantsTable').append(template);
    }
}