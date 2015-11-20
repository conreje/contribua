<?php
return Swift_Mailer::newInstance(
    Swift_SmtpTransport::newInstance('h4.hserv.com.br', 465, 'ssl')
        ->setUsername('contribua@conreje.com.br')
        ->setPassword('conreje')
);