<?php
namespace Conreje\Contribua;

abstract class Form
{
    /**
     * @var Mailer
     */
    private $mailer;

    /**
     * @var array
     */
    private $from;

    /**
     * @param Mailer $mailer
     * @param array $from
     */
    public function __construct(Mailer $mailer, array $from)
    {
        $this->mailer = $mailer;
        $this->from = $from;
    }

    /**
     * @return static
     */
    public static function defaultForm()
    {
        return new static(
            Mailer::defaultMailer(),
            ['contribua@conreje.com.br' => 'CONREJE']
        );
    }

    /**
     * @param array $data
     *
     * @return ServerResponse
     */
    public function process(array $data)
    {
        $data = $this->filter($this->decode($data));

        if (!$this->isValid($data)) {
            return ServerResponse::json(['error' => 'Você preencher os dados corretamente!'], 400);
        }

        if (!$this->send($data)) {
            return ServerResponse::json(
                ['error' => 'Não foi possível enviar sua mensagem, tente novamente.'],
                400
            );
        }

        $data['id'] = uniqid();

        return ServerResponse::json($data);
    }

    /**
     * @param array $data
     *
     * @return array
     */
    private function decode(array $data)
    {
        if (!empty($data)) {
            return $data;
        }

        return json_decode(file_get_contents('php://input'), true);
    }

    /**
     * @param array $data
     *
     * @return bool
     */
    private function send(array $data)
    {
        $message = Message::plainText(
            $this->getSubject(),
            $this->renderBody($data),
            $this->from,
            $this->from,
            [$data['email'] => $data['name']]
        );

        return $this->mailer->send($message);
    }

    /**
     * @param array $data
     *
     * @return string
     */
    private function renderBody(array $data)
    {
        return preg_replace_callback(
            '/\<(\w+)\>/',
            function($matches) use ($data) {
                if (!array_key_exists($matches[1], $data)) {
                    return '';
                }

                return $data[$matches[1]];
            },
            $this->getTemplate()
        );
    }
    /**
     * @param array $data
     *
     * @return array
     */
    protected function filter(array $data)
    {
        return filter_var_array(
            $data,
            [
                'name' => FILTER_SANITIZE_STRING,
                'email' => FILTER_SANITIZE_EMAIL
            ]
        );
    }

    /**
     * @param array $data
     *
     * @return boolean
     */
    protected function isValid(array $data)
    {
        return !(
            empty($data['name']) ||
            !filter_var($data['email'], FILTER_VALIDATE_EMAIL)
        );
    }

    /**
     * @return string
     */
    protected abstract function getSubject();

    /**
     * @return string
     */
    protected abstract function getTemplate();
}
