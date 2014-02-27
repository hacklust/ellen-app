<?php

define('SOURCE','http://api.wolframalpha.com/v2/query?');
define('APP_ID','GQ6GQJ-X5V2URXJWX');

$query = http_build_query($_GET);

echo file_get_contents(SOURCE.$query.'&appid='.APP_ID);