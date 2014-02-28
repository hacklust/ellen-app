<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

$postdata = file_get_contents("php://input");
$data = json_decode($postdata, true);

switch ($data['action']) {
    case 'query':
        define('SOURCE', 'http://api.wolframalpha.com/v2/query?');
        define('APP_ID', 'GQ6GQJ-P8KXPLVLT6');

        define('PANDORA_URL', 'http://www.pandorabots.com/pandora/talk-xml');
        define('BOT_ID', 'a7ca5b1eae340ff9');

        $response = file_get_contents(SOURCE . 'input=' . urlencode($data['query']) . '&appid=' . APP_ID);
        $xml = simplexml_load_string($response);
        
        //by pass wolfram for now
        if (false && (string) $xml['success'] == 'true') {
            $pods = $xml->pod;
            $that = (string) $pods[1]->subpod[0]->plaintext[0];
            $image = '';
            
            foreach($pods as $pod){
                if((string) $pod['title'] === 'Image'){
                    $image = (string) $pod->subpod[0]->img[0]['src'];
                }
            }
            
            echo json_encode(array(
                'source' => 'wolframalpha',
                'image' => $image,
                'response' => $that
            ));
        } else {
            $curl = curl_init(PANDORA_URL);
            $cookie = 'cookies.txt';
            $fields = 'input=' . urlencode($data['query']) . '&botid=' . BOT_ID;

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

            $response = curl_exec($curl);
            $xml = simplexml_load_string($response);
                    
            echo json_encode(array(
                'source' => 'pandorabots',
                'response' => (string) $xml->that[0],
                'custid' => (string) $xml['custid']
            ));
        }
        break;
    case 'teach':
        
        break;
}