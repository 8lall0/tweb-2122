<?php

require_once 'common.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new CustomHttpException("Bad Request", 405);
    }

    $username = $_POST['username'];
    $password = $_POST['password'];

    if (empty($username)) {
        throw new CustomHttpException("Bad Username", 400);
    }
    if (empty($password)) {
        throw new CustomHttpException("Bad Password", 400);
    }

    $db = new DBConnection();

    $q = "SELECT id, username, password, role FROM user WHERE username = ?;";
    $stmt = $db->prepare($q);
    $stmt->execute([$username]);

    $response = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$response || !password_verify($password, $response['password'])) {
        throw new CustomHttpException("Bad Credentials", 401);
    }

    UserSession::setSession(intval($response['id']), $response['username'], $response['role'] === 0);

    $stmt = null;
} catch (CustomHttpException $e) {
    jsonError($e->getMessage(), $e->getHttpCode());
} catch (Exception $e) {
    json_encode(['error' => $e->getMessage()]);
}