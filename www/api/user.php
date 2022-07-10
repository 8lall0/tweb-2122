<?php

require_once 'common.php';

try {
    if (!UserSession::isLogged() || UserSession::isBlocked() || !UserSession::isAdmin()) {
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

            $q = "SELECT id, username, blocked, role FROM user WHERE id = ?";
            $stmt = $db->prepare($q);
            $stmt->execute([$id]);
            $response = $stmt->fetch(PDO::FETCH_ASSOC);

            break;
        case 'PATCH':
            $id = $_PATCH['id'];
            $blocked = $_PATCH['blocked'] ?? null;
            $role = $_PATCH['role'] ?? null;

            if (empty($id)) {
                throw new CustomHttpException("Bad Content", 400);
            }

            $stmt = null;


            if (!is_null($blocked)) {
                $q = "UPDATE user SET blocked = ? WHERE id = ?";
                $stmt = $db->prepare($q);
                $stmt->execute([$blocked, $id]);
            }

            if (!is_null($role)) {
                $q = "UPDATE user SET role = ? WHERE id = ?";
                $stmt = $db->prepare($q);
                $stmt->execute([$role, $id]);
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