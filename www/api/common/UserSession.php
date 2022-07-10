<?php

require_once 'DBConnection.php';

class UserSession
{
    public static function setSession($id, $username, $isAdmin = false) {
        $_SESSION['user']['id'] = $id;
        $_SESSION['user']['username'] = $username;
        $_SESSION['user']['isAdmin'] = $isAdmin;
    }

    public static function getSession() {
        return $_SESSION['user'];
    }

    public static function deleteSession() {
        session_destroy();
    }

    public static function isLogged() {
        return isset($_SESSION['user']);
    }

    public static function isBlocked() {
        $db = new DBConnection();

        $q = "SELECT id FROM user  WHERE id = ? AND blocked = 0";
        $stmt = $db->prepare($q);
        $stmt->execute([$_SESSION['user']['id']]);
        $response = $stmt->fetch(PDO::FETCH_ASSOC);

        return (empty($response));
    }

    public static function isAdmin() {
        return $_SESSION['user']['isAdmin'] ?? false;
    }

}