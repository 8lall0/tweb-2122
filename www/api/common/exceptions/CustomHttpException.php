<?php

class CustomHttpException extends Exception {
    private $httpCode;

    public function __construct($message, $httpCode) {
        parent::__construct($message);
        $this->httpCode = $httpCode;
    }

    public function getHttpCode() {
        return $this->httpCode;
    }
}