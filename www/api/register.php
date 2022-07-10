<?php

require_once 'common.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new CustomHttpException("Bad Request", 405);
    }

    $username = $_POST['username'];
    $password = $_POST['password'];
    $passwordRepeat = $_POST['password_repeat'];

    if (empty($username)) {
        throw new CustomHttpException("Bad Username", 400);
    }
    if (empty($password) || empty($passwordRepeat)) {
        throw new CustomHttpException("Bad Password", 400);
    }
    if ($password !== $passwordRepeat) {
        throw new CustomHttpException("Password not the same", 400);
    }

    $db = new DBConnection();

    $q = "SELECT username FROM user WHERE username = ? AND blocked = 0";
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

    UserSession::setSession($id, $username, false);

    $stmt = null;

} catch (CustomHttpException $e) {
    jsonError($e->getMessage(), $e->getHttpCode());
} catch (Exception $e) {
    jsonError($e->getMessage(), 400);
}
