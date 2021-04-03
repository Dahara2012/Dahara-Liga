$( document ).ready(function() {
    //console.log("ready event");
    let params = new URLSearchParams(document.location.search.substring(1));
    let page = params.get("page");
    console.log('load' +page);
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
        case 'signup':
            $("#content").load("signup.html");
            break;
        case 'live':
            $("#content").load("live.html");
            break;
        case 'rules':
            $("#content").load("rules.html");
            break;
        default:
            $("#content").load("init.html");
      }
});