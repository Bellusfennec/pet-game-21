<?php
// извлечь домен и зону домена
list($areaDomain, $domain) = explode('.',strrev($_SERVER['HTTP_HOST']));
//получить зону домена
$areaDomain = strrev($areaDomain);
// получить домен
$domain = strrev($domain);
// получить поддомен
$subDomain = array_shift(explode('.', $_SERVER['HTTP_HOST'])); 
// определить контроллер
if ($subDomain == $domain){
    include_once '../app/controllers/main/indexController.php';
} else {
    include_once '../app/controllers/'.$subDomain.'/indexController.php';
}

