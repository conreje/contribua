<?php
namespace Conreje\Contribua;

final class ContactForm extends Form
{
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
                'email' => FILTER_SANITIZE_EMAIL,
                'phone' => FILTER_SANITIZE_STRING,
                'message' => FILTER_SANITIZE_STRING
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
            empty($data['phone']) ||
            empty($data['message']) ||
            !filter_var($data['email'], FILTER_VALIDATE_EMAIL)
        );
    }

    /**
     * @return string
     */
    protected function getSubject()
    {
        return 'Contato - Conreje';
    }

    /**
     * @return string
     */
    protected function getTemplate()
    {
        return file_get_contents(__DIR__ . '/../templates/contato.txt');
    }
}
