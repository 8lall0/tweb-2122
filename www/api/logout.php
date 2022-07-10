<?php

require_once 'common.php';

try {
    // LEGGIMI: https://stackoverflow.com/questions/3521290/logout-get-or-post
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new CustomHttpException("Bad Request", 405);
    }
    UserSession::deleteSession();
} catch (CustomHttpException $e) {
    jsonError($e->getMessage(), $e->getHttpCode());
} catch (Exception $e) {
    json_encode(['error' => $e->getMessage()]);
}