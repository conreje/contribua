<?php
require 'vendor/autoload.php';

use Conreje\Contribua\Form\Contact;

$form = Contact::defaultForm();
$form->process($_POST)->send();
