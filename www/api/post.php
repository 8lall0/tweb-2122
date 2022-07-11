<?php

require_once 'common.php';

try {
    if (!UserSession::isLogged() || UserSession::isBlocked()) {
        throw new CustomHttpException("Unhautorized", 403);
    }

    $sessionData = UserSession::getSession();
    $db = new DBConnection();

    $method = $_SERVER['REQUEST_METHOD'];
    $userId = $sessionData['id'];
    $response = [];

    switch ($method) {
        case 'GET':
            $id = $_GET['id'];

            if (empty($id)) {
                throw new CustomHttpException("Bad Content", 400);
            }

            $q = "SELECT p.id, u.id as userId, u.username, p.title, p.content, p.created_at, p.modified_at FROM post AS p, user AS u WHERE p.id = ? AND p.id_user = u.id";
            $stmt = $db->prepare($q);
            $stmt->execute([$id]);
            $response = $stmt->fetch(PDO::FETCH_ASSOC);

            break;
        case 'POST':
            $title = $_POST['title'] ?? null;
            $content = $_POST['content'] ?? null;

            if (is_null($title) || is_null($content)) {
                throw new CustomHttpException("Bad Content", 400);
            }

            if (strlen($title) < 5 || strlen($content) < 15) {
                throw new CustomHttpException("Bad Content", 400);
            }

            $title = htmlspecialchars($title, ENT_QUOTES);
            $content = htmlspecialchars($content, ENT_QUOTES);

            $q = "INSERT INTO post (id_user, title, content) VALUES (?, ?, ?);";
            $stmt = $db->prepare($q);

            $stmt->execute([$userId, $title, $content]);

            $id = $db->lastInsertId();

            $stmt = null;

            $response = ['id' => $id];

            break;
        case 'PATCH':
            $id = $_PATCH['id'];
            $title = $_PATCH['title'] ?? null;
            $content = $_PATCH['content'] ?? null;

            if (empty($id)) {
                throw new CustomHttpException("Bad Content", 400);
            }

            if (is_null($title) || is_null($content)) {
                throw new CustomHttpException("Bad Content", 400);
            }

            if (strlen($title) < 5 || strlen($content) < 15) {
                throw new CustomHttpException("Bad Content", 400);
            }

            $title = htmlspecialchars($title, ENT_QUOTES);
            $content = htmlspecialchars($content, ENT_QUOTES);

            $q = "UPDATE post SET title = ?, content = ?, modified_at = ? WHERE id = ? AND id_user = ?";
            $stmt = $db->prepare($q);
            $stmt->execute([$title, $content, date("Y-m-d H:i:s"), $id, $userId]);

            if ($stmt->rowCount() <= 0) {
                throw new CustomHttpException("Bad Content", 403);
            }

            $stmt = null;

            $response = ['id' => $id];

            break;
        case 'DELETE':
            $id = $_DELETE['id'];

            if (empty($id)) {
                throw new CustomHttpException("Bad Content", 400);
            }

            $stmt = null;

            if (UserSession::isAdmin()) {
                $q = "DELETE FROM post WHERE id = ?";
                $stmt = $db->prepare($q);
                $stmt->execute([$id]);
            } else {
                $q = "DELETE FROM post WHERE id = ? AND id_user = ?;";
                $stmt = $db->prepare($q);
                $stmt->execute([$id, $userId]);
            }

            if ($stmt->rowCount() <= 0) {
                throw new CustomHttpException("Bad Content", 403);
            }

            $q1 = "DELETE FROM comment WHERE id_post = ?;";
            $stmt = $db->prepare($q1);
            $stmt->execute([$id]);

            $stmt = null;

            $response = ['id' => $id];

            break;
        default:
            throw new CustomHttpException("Bad Request", 405);
    }
    jsonArrayResponse($response);
} catch (CustomHttpException $e) {
    jsonError($e->getMessage(), $e->getHttpCode());
} catch (Exception $e) {
    jsonError($e->getMessage(), 500);
}