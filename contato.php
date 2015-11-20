<?php
require 'vendor/autoload.php';

use Conreje\Contribua\ContactForm;

$form = ContactForm::defaultForm();
$form->process($_POST)->send();

use Conreje\Contribua\ServerResponse;

if (empty($_POST)) {
    ServerResponse::json(['error' => 'Você deve enviar os dados'], 400)->send();
}

$nome=$_POST['nomeremetente'];
$email=$_POST['emailremetente'];
$telefone=$_POST['telefone'];
$texto=$_POST['mensagem'];
$mensagem="
Uma mensagem vinda do site !
Algum vistante mandou essa mensagem pelo site.
Nome: $nome
Email: $email
Telefone:  $telefone
Mensagem: $texto";


require('lib/swift_required.php');
$transport = Swift_SmtpTransport::newInstance('h4.hserv.com.br', 465, 'ssl')
    ->setUsername('contribua@conreje.com.br')
    ->setPassword('conreje');
$mailer = Swift_Mailer::newInstance($transport);
$message = Swift_Message::newInstance('CONREJE')
    ->setFrom(array('contribua@conreje.com.br' => 'CONREJE'))
    ->setTo(array('contribua@conreje.com.br'))
    ->setReplyTo($email)
    ->setBody($mensagem);

if ($mailer->send($message)){
	header("Location: http://contribua.conreje.com.br/sucesso.html");
}
else{
	header("Location: http://contribua.conreje.com.br/falha.html");
}
