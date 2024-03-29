<?php

require_once 'common.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new CustomHttpException("Bad Request", 405);
    }
    if (!UserSession::isLogged() || UserSession::isBlocked() || !UserSession::isAdmin()) {
        throw new CustomHttpException("Unhautorized", 403);
    }

    $sessionData = UserSession::getSession();
    $db = new DBConnection();

    $userId = $sessionData['id'];

    $q = "SELECT id, username, blocked, role FROM user WHERE id <> " . $userId . ";";
    $response = $db->query($q)->fetchAll(PDO::FETCH_ASSOC);

    jsonArrayResponse($response);
} catch (CustomHttpException $e) {
    jsonError($e->getMessage(), $e->getHttpCode());
} catch (Exception $e) {
    jsonError($e->getMessage(), 500);
}