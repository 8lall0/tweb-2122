<?php

class DBConnection extends PDO {
    public function __construct() {
        $hostname = "database";
        $dbname = "forum";
        $user = "root";
        $pass = "tiger";

        parent::__construct("mysql:host=$hostname;dbname=$dbname;port=3306", $user, $pass);
        $this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    }
}