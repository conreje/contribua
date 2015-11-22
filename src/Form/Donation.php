<?php
namespace Conreje\Contribua\Form;

use Conreje\Contribua\Form;

final class Donation extends Form
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
                'products' => [
                    'filter' => FILTER_SANITIZE_STRING,
                    'flags' => FILTER_FORCE_ARRAY
                ]
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
            empty($data['products']) ||
            !filter_var($data['email'], FILTER_VALIDATE_EMAIL)
        );
    }

    /**
     * {@inheritdoc}
     */
    protected function manipulate(array $data)
    {
        $data['products'] = implode(
            PHP_EOL,
            array_map(
                function(array $product) {
                    return sprintf(
                        '- %s (%s): %d %s',
                        $product['name'],
                        $product['category'],
                        $product['quantity'],
                        $product['metric']
                    );
                },
                $data['products']
            )
        );

        return $data;
    }

    /**
     * @return string
     */
    protected function getSubject()
    {
        return 'Doação - Conreje';
    }

    /**
     * @return string
     */
    protected function getTemplate()
    {
        return file_get_contents(__DIR__ . '/../../templates/doacao.txt');
    }
}
