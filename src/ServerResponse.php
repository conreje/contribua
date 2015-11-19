<?php
namespace Conreje\Contribua;

final class ServerResponse
{
    private $code;
    private $headers;
    private $body;

    private function __construct() {}

    /**
     * @param array $data
     * @param number $code
     *
     * @return self
     */
    public static function json(array $data, $code = 200, array $headers = [])
    {
        $response = new self();

        $response->body = json_encode($data);
        $response->code = $code;
        $response->headers = array_merge(
            $headers,
            ['Content-Type' => 'application/json; charset=UTF-8']
        );

        return $response;
    }

    public function send()
    {
        foreach ($this->headers as $name => $value) {
            header($name . ':' . $value, true);
        }

        http_response_code($this->code);
        die($this->body);
    }
}
