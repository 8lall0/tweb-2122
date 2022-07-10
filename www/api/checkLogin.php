<?php

require_once 'common.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new CustomHttpException("Bad Request", 405);
    }

    if (!UserSession::isLogged() || UserSession::isBlocked()) {
        throw new CustomHttpException("Unhautorized", 403);
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(UserSession::getSession());
} catch (CustomHttpException $e) {
    jsonError($e->getMessage(), $e->getHttpCode());
} catch (Exception $e) {
    json_encode(['error' => $e->getMessage()]);
}