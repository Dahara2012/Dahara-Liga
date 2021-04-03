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
    die("<b>objekt Paramter muss vorhanden sein</b> </br>".$error_explain);
}
//Objekt-ID-Paramter muss vorhanden und numerisch sein
if (isset($_GET['id'])){
    $objektid   = $_GET['id'];
    if (!is_numeric($objektid)){
        die("<b>id Paramter muss numerisch sein</b> </br>".$error_explain);
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
    case 'season':
        getSeason($objektid);
        break;
    case 'team':
        getTeam($objektid);
        break;
    case 'user':
        getUser($objektid);
        break;
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
        $statement = $connection->prepare('SELECT * FROM race WHERE ID = ?');
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
        $statement = $connection->prepare('SELECT * FROM result WHERE ID = ?');
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