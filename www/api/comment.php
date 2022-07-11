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

            $q = "SELECT c.id, u.username, c.id_user as userId, c.content, c.created_at, c.modified_at FROM comment AS c,
               user AS u WHERE c.id = ? AND c.id_user = u.id";
            $stmt = $db->prepare($q);
            $stmt->execute([$id]);
            $response = $stmt->fetch(PDO::FETCH_ASSOC);

            break;
        case 'POST':
            $postId = $_POST['postId'] ?? null;
            $content = $_POST['content'] ?? null;

            if (is_null($content) || is_null($postId)) {
                throw new CustomHttpException("Bad Content", 400);
            }

            if (strlen($content) < 5) {
                throw new CustomHttpException("Bad Content", 400);
            }

            $q = "INSERT INTO comment (id_user, id_post, content) VALUES (?, ?, ?);";
            $stmt = $db->prepare($q);

            $stmt->execute([$userId, $postId, $content]);

            $id = $db->lastInsertId();

            $stmt = null;

            $response = ['id' => $id];

            break;
        case 'PATCH':
            $id = $_PATCH['id'] ?? null;
            $content = $_PATCH['content'] ?? null;

            if (is_null($content) || is_null($id)) {
                throw new CustomHttpException("Bad Content", 400);
            }

            if (strlen($content) < 5) {
                throw new CustomHttpException("Bad Content", 400);
            }

            $q = "UPDATE comment SET content = ?, modified_at = ? WHERE id = ? AND id_user = ?";
            $stmt = $db->prepare($q);
            $stmt->execute([$content, date("Y-m-d H:i:s"), $id, $userId]);

            if ($stmt->rowCount() <= 0) {
                throw new CustomHttpException("Bad Content", 403);
            }

            $q2 = "SELECT id_post FROM comment WHERE id = ?";
            $stmt = $db->prepare($q2);
            $stmt->execute([$id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            $stmt = null;

            $response = ['id' => $id, 'postId' => $result['id_post']];
            break;
        case 'DELETE':
            $id = $_DELETE['id'] ?? null;

            if (is_null($id)) {
                throw new CustomHttpException("Bad Content", 400);
            }

            $stmt = null;
            if (UserSession::isAdmin()) {
                $q = "DELETE FROM comment WHERE id = ?";
                $stmt = $db->prepare($q);
                $stmt->execute([$id]);
            } else {
                $q = "DELETE FROM comment WHERE id = ? AND id_user = ?";
                $stmt = $db->prepare($q);
                $stmt->execute([$id, $userId]);
            }

            if ($stmt->rowCount() <= 0) {
                throw new CustomHttpException("Bad Content", 403);
            }

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