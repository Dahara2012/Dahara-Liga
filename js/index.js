$( document ).ready(function() {
    //console.log("ready event");
    let params = new URLSearchParams(document.location.search.substring(1));
    let page = params.get("page");
    console.log('load ' +page);
    switch(page) {
        case 'init':
            $("#content").load("init.html");
            break;
        case 'calendar':
            $("#content").load("calendar.html");
            break;
        case 'standings':
            $("#content").load("standings.html");
            break;
        case 'live':
            $("#content").load("live.html");
            break;
        case 'result':
            $("#content").load("result.html");
            break;
        default:
            $("#content").load("init.html");
    }
});

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

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


function formatLaptimes(miliseconds){
    let min = Math.floor(miliseconds/60000);
    let sec = Math.floor(miliseconds%60000/1000);
    let ms = Math.floor(miliseconds%1000);
    //let ms  = 
    return min+':'+pad(sec,2)+':'+pad(ms,3);
}