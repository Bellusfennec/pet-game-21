<?php

define("DEBUG", 1);
define("ROOT", dirname(__DIR__));
define("WWW", ROOT . '/public_html');
define("APP", ROOT . '/app');
define("CORE", ROOT . '/vendor/zshop/core');
define("LIBS", ROOT . '/vendor/zshop/core/libs');
define("CACHE", ROOT . '/tmp/cache');
define("CONF", ROOT . '/config');
define("LAYOUT", ROOT . 'default');


// http://www.dikovinka.net/index.php
$app_path = "http://{$_SERVER['HTTP_HOST']}{$_SERVER['PHP_SELF']}";
// http://www.dikovinka.net/
$app_path = preg_replace("#[^/]+$#", '', $app_path);
// http://www.dikovinka.net
$app_path = str_replace('t/', 't', $app_path);
define("PATH", $app_path);
define("ADMIN", PATH . '/admin');