<?php

define('PANDORA_URL','http://www.pandorabots.com/pandora/talk-xml');
define('BOT_ID','90bd3579ce344e75');

$curl = curl_init(PANDORA_URL);
$cookie = 'cookies.txt';
$fields = http_build_query($_GET).'&botid='.BOT_ID;

$header = array();
$header[0] = "Accept: text/xml,application/xml,application/xhtml+xml,";
$header[0] .= "text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5";
$header[] = "Cache-Control: max-age=0";
$header[] = "Connection: keep-alive";
$header[] = "Keep-Alive: 300";
$header[] = "Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7";
$header[] = "Accept-Language: en-us,en;q=0.5";
$header[] = "Pragma: "; // browsers keep this blank.

curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US; rv:1.8.1.7) Gecko/20070914 Firefox/2.0.0.7');
curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
curl_setopt($curl, CURLOPT_COOKIEJAR, $cookie);
curl_setopt($curl, CURLOPT_COOKIEFILE, $cookie);
curl_setopt($curl, CURLOPT_AUTOREFERER, true);
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

curl_setopt($curl, CURLOPT_POST, 1);
curl_setopt($curl, CURLOPT_REFERER, '');
curl_setopt($curl, CURLOPT_POSTFIELDS, $fields);

echo curl_exec($curl);