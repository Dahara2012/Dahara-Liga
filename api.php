<?php
//Error Reporting (dev)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//include "helper_functions.php";
include "./config/db.php";

//Fallunterscheidung
//Objekt-Paramter muss vorhanden sein
if (isset($_GET['objekt'])){
    $objekt = $_GET['objekt'];
}else {
    die("<b>objekt Paramter muss vorhanden sein</b> </br>");
}
//Objekt-ID-Paramter muss vorhanden und numerisch sein
if (isset($_GET['id'])){
    $objektid   = $_GET['id'];
    if (!is_numeric($objektid)){
        die("<b>id Paramter muss numerisch sein</b> </br>");
    }
}else{
    $objektid = 'list';
}
//Je nach Parameter richtiges Objekt zurückgeben
switch ($objekt) {
    case 'penalty':
        getPenalty($objektid);
        break;
    case 'race':
        getRace($objektid);
        break;
    case 'result':
        getResult($objektid);
        break;
    case 'incidents':
        getIncidents($objektid);
         break;
    case 'teamincidents':
        getTeamIncidents($objektid);
        break;
    case 'teamincidentsteampage':
        getTeamIncidentsTeampage($objektid);
        break;
    case 'season':
        getSeason($objektid);
        break;
    case 'team':
        getTeam($objektid);
        break;
    case 'user':
        getUser($objektid);
        break;
    case 'discordonly':
        getDiscordOnlyAccounts($objektid);
        break;
    case 'soloStandings':
        getSoloStandings();
        break;
    case 'teamStandings':
        getTeamStandings();
        break;
    case 'driverPenalties':
        getDriverPenalties($objektid);
        break;
    case 'kader':
        getKader($objektid);
        break;
    case 'teamresults':
        getTeamResults($objektid);
        break;
    case 'participants':
        getParticipants($objektid);
        break;
}
function getKader($objektid){
    $connection = init_connection();
    if ($objektid == 'list'){
        $statement = $connection->query("SELECT * FROM `user` LEFT JOIN `discord` on `user`.`discord` = `discord`.`discordid`");
    }else{
        $statement = $connection->prepare('SELECT * FROM `user` LEFT JOIN `discord` on `user`.`discord` = `discord`.`discordid` WHERE `team` = ?');
        $statement->execute([$objektid]);
    }
    $rows = array();
    while ($row = $statement->fetch())
    {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    print json_encode($rows, JSON_PRETTY_PRINT);
}

function getPenalty($objektid){
    $connection = init_connection();
    if ($objektid == 'list'){
        $statement = $connection->query("SELECT * FROM penalty");
    }else{
        $statement = $connection->prepare('SELECT * FROM penalty WHERE ID = ?');
        $statement->execute([$objektid]);
    }
    $rows = array();
    while ($row = $statement->fetch())
    {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    print json_encode($rows, JSON_PRETTY_PRINT);
}

function getRace($objektid){
    $connection = init_connection();
    if ($objektid == 'list'){
        $statement = $connection->query("SELECT * FROM race");
    }else{
        $statement = $connection->prepare("SELECT * FROM race WHERE ID = ?");
        $statement->execute([$objektid]);
    }
    $rows = array();
    while ($row = $statement->fetch())
    {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    print json_encode($rows, JSON_PRETTY_PRINT);
}

function getDriverPenalties($objektid){
    $connection = init_connection();
    $statement = $connection->prepare("SELECT (SELECT SUM(`pp`) as 'gesamtstrafpunkte' FROM `penalty` WHERE `user` = ?) - (SELECT COUNT(DISTINCT `race`) as 'countRennen' FROM `result`) AS 'strafpunkte'");
    $statement->execute([$objektid]);
    $rows = array();
    while ($row = $statement->fetch())
    {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    print json_encode($rows, JSON_PRETTY_PRINT);
}

function getSoloStandings(){
    $connection = init_connection();
    $statement = $connection->query("SELECT `user`.`name` as 'username', `user`.`id` as 'userid', `team`.`name` as 'teamname', `avatarurl`, `user`, SUM(`points`) as 'gesamtpunkte' FROM `result` LEFT JOIN points on result.position = points.position LEFT JOIN `user` on `user` = `user`.`id` LEFT JOIN `discord` on `user`.`discord` = `discord`.`discordid` LEFT JOIN `team` on `user`.`team` = `team`.`id`GROUP BY `user` ORDER BY `gesamtpunkte` DESC");
    $rows = array();
    while ($row = $statement->fetch())
    {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    print json_encode($rows, JSON_PRETTY_PRINT);
}

function getTeamStandings(){
    $connection = init_connection();
    $statement = $connection->query("SELECT team.name AS 'teamname', SUM(`points`) as 'gesamtpunkte', team.strafpunkte, team.id as 'teamid' FROM `result` LEFT JOIN points on result.position = points.position join `user` on result.`user` = `user`.`id` join team on `user`.team = team.`id` group by team.id ORDER BY `gesamtpunkte` DESC");
    $rows = array();
    while ($row = $statement->fetch())
    {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    print json_encode($rows, JSON_PRETTY_PRINT);
}

function getIncidents($objektid){
    $connection = init_connection();
    if ($objektid == 'list'){
        $statement = $connection->query("SELECT * FROM penalty");
    }else{
        $statement = $connection->prepare("SELECT `user`.name as 'fahrername', team.name as 'teamname', penalty.pp as 'strafe', wo, `description` FROM `penalty` join user on penalty.`user` = `user`.`id` join team on `user`.team = team.id WHERE `race` = ?");
        $statement->execute([$objektid]);
    }
    $rows = array();
    while ($row = $statement->fetch())
    {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    print json_encode($rows, JSON_PRETTY_PRINT);
}

function getTeamIncidents($objektid){
    $connection = init_connection();
    if ($objektid == 'list'){
        $statement = $connection->query("SELECT * FROM teampenalty");
    }else{
        $statement = $connection->prepare("SELECT name AS 'teamname', pp as 'strafe', wo, description FROM `teampenalty` join `team` on `teampenalty`.`team` = `team`.`id` WHERE `race` = ?");
        $statement->execute([$objektid]);
    }
    $rows = array();
    while ($row = $statement->fetch())
    {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    print json_encode($rows, JSON_PRETTY_PRINT);
}

function getTeamIncidentsTeampage($objektid){
    $connection = init_connection();
    if ($objektid == 'list'){
        $statement = $connection->query("SELECT * FROM teampenalty");
    }else{
        $statement = $connection->prepare("SELECT name AS 'teamname', pp as 'strafe', wo, description FROM `teampenalty` LEFT join `team` on `teampenalty`.`team` = `team`.`id` WHERE `team`.`id` = ?");
        $statement->execute([$objektid]);
    }
    $rows = array();
    while ($row = $statement->fetch())
    {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    print json_encode($rows, JSON_PRETTY_PRINT);
}

function getResult($objektid){
    $connection = init_connection();
    if ($objektid == 'list'){
        $statement = $connection->query("SELECT * FROM result");
    }else{
        $statement = $connection->prepare('SELECT result.id as resultId, race, result.position, points, cars.car, qualipos, gap, quali, fastest, user.name as username, team.name as teamname FROM `result` left join user on `user` = `user`.`id` left join team on user.team = team.id left join points on result.position = points.position join cars on result.car = cars.id WHERE race = ? ORDER BY position ASC');
        $statement->execute([$objektid]);
    }
    $rows = array();
    while ($row = $statement->fetch())
    {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    print json_encode($rows, JSON_PRETTY_PRINT);
}

function getTeamResults($objektid){
    $connection = init_connection();
    $statement = $connection->prepare('SELECT race, user, position, qualipos, quali, gap, fastest, cars.car, name, discord, iracingid, team FROM `result` left join cars on result.car = cars.id join user on `result`.`user` = `user`.`id` WHERE team = ?');
    $statement->execute([$objektid]);
    $rows = array();
    while ($row = $statement->fetch())
    {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    print json_encode($rows, JSON_PRETTY_PRINT);
}

function getSeason($objektid){
    $connection = init_connection();
    if ($objektid == 'list'){
        $statement = $connection->query("SELECT * FROM season");
    }else{
        $statement = $connection->prepare('SELECT * FROM season WHERE ID = ?');
        $statement->execute([$objektid]);
    }
    $rows = array();
    while ($row = $statement->fetch())
    {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    print json_encode($rows, JSON_PRETTY_PRINT);
}

function getTeam($objektid){
    $connection = init_connection();
    if ($objektid == 'list'){
        $statement = $connection->query("SELECT * FROM team");
    }else{
        $statement = $connection->prepare('SELECT * FROM team WHERE ID = ?');
        $statement->execute([$objektid]);
    }
    $rows = array();
    while ($row = $statement->fetch())
    {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    print json_encode($rows, JSON_PRETTY_PRINT);
}

function getUser($objektid){
    $connection = init_connection();
    if ($objektid == 'list'){
        $statement = $connection->query("SELECT * FROM user");
    }else{
        $statement = $connection->prepare('SELECT * FROM user WHERE ID = ?');
        $statement->execute([$objektid]);
    }
    $rows = array();
    while ($row = $statement->fetch())
    {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    print json_encode($rows, JSON_PRETTY_PRINT);
}

function getParticipants($objektid){
    $connection = init_connection();
    if ($objektid == 'list'){
        $statement = $connection->query("SELECT `user`.`name` as 'driver', `iracingid`, `team`.`name` as 'team' FROM `user` left join `team` on `team` = `team`.`id`");
    }else{
        $statement = $connection->prepare('SELECT * FROM `user` left join team on `team` = `team`.id WHERE `user`.id = ?');
        $statement->execute([$objektid]);
    }
    $rows = array();
    while ($row = $statement->fetch())
    {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    print json_encode($rows, JSON_PRETTY_PRINT);
}

function getDiscordOnlyAccounts($objektid){
    $connection = init_connection();
    if ($objektid == 'list'){
        $statement = $connection->query("SELECT * FROM `discord` left join `user` on `discordid` = `discord` WHERE `user`.`id` is NULL");
    }else{
        $statement = $connection->prepare('SELECT * FROM `discord` left join `user` on `discordid` = `discord` WHERE `user`.`id` is NULL WHERE `discordid` = ?');
        $statement->execute([$objektid]);
    }
    $rows = array();
    while ($row = $statement->fetch())
    {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    print json_encode($rows, JSON_PRETTY_PRINT);
}

//Datenbankverbindung herstellen
function init_connection(){
    $host = $GLOBALS["servername"];
    $db   = $GLOBALS["dbname"];
    $user = $GLOBALS["username"];
    $pass = $GLOBALS["password"];
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    try {
        $pdo = new PDO($dsn, $user, $pass, $options);
        return $pdo;
    } catch (\PDOException $e) {
        throw new \PDOException($e->getMessage(), (int)$e->getCode());
    }
}
?>
