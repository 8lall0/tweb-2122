<?php

require_once 'common.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new CustomHttpException("Bad Request", 405);
    }
    if (!UserSession::isLogged() || UserSession::isBlocked()) {
        throw new CustomHttpException("Unhautorized", 403);
    }

    $id = $_GET['postId'];

    if (empty($id)) {
        throw new CustomHttpException("Bad Request", 405);
    }

    $db = new DBConnection();

    $q = "SELECT c.id, s.username, s.id AS user_id, c.content, c.created_at, c.modified_at 
            FROM comment AS c, user AS s WHERE c.id_post = ? AND c.id_user = s.id;";
    $stmt = $db->prepare($q);
    $stmt->execute([$id]);
    $response = $stmt->fetchAll(PDO::FETCH_ASSOC);

    jsonArrayResponse($response);
} catch (CustomHttpException $e) {
    jsonError($e->getMessage(), $e->getHttpCode());
} catch (Exception $e) {
    jsonError($e->getMessage(), 500);
}