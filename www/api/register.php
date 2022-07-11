<?php

require_once 'common.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new CustomHttpException("Bad Request", 405);
    }

    $username = $_POST['username'] ?? null;
    $password = $_POST['password'] ?? null;
    $passwordRepeat = $_POST['password_repeat'] ?? null;

    if (is_null($username) || is_null($password) || is_null($passwordRepeat)) {
        throw new CustomHttpException("Bad Request", 400);
    }

    if (count($username) < 4) {
        throw new CustomHttpException("Bad Request", 400);
    }

    foreach ($username as $testcase) {
        if (!ctype_alnum($testcase)) {
            throw new CustomHttpException("Bad Request", 400);
        }
    }

    if ($password !== $passwordRepeat) {
        throw new CustomHttpException("Bad Request", 400);
    }

    $db = new DBConnection();

    $q = "SELECT username FROM user WHERE username = ?";
    $stmt = $db->prepare($q);
    $stmt->execute([$username]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        throw new CustomHttpException("Username already exists", 409);
    }

    $q = "INSERT INTO user (username, password) VALUES (?, ?);";
    $stmt = $db->prepare($q);
    $stmt->execute([$username, password_hash($password, PASSWORD_DEFAULT)]);

    $id = $db->lastInsertId();

    UserSession::setSession($id, $username);

    $stmt = null;

} catch (CustomHttpException $e) {
    jsonError($e->getMessage(), $e->getHttpCode());
} catch (Exception $e) {
    jsonError($e->getMessage(), 400);
}
