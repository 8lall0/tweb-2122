<?php

require_once 'common.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new CustomHttpException("Bad Request", 405);
    }
    if (!UserSession::isLogged() || UserSession::isBlocked()) {
        throw new CustomHttpException("Unhautorized", 403);
    }

    $db = new DBConnection();

    $q = "SELECT p.id, s.username, p.title, p.created_at, p.modified_at, s.blocked FROM post AS p, user AS s WHERE s.id = p.id_user;";
    $response = $db->query($q)->fetchAll(PDO::FETCH_ASSOC);

    jsonArrayResponse($response);
} catch (CustomHttpException $e) {
    jsonError($e->getMessage(), $e->getHttpCode());
} catch (Exception $e) {
    jsonError($e->getMessage(), 500);
}