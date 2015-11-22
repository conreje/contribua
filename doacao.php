<?php
require 'vendor/autoload.php';

use Conreje\Contribua\Form\Donation;

$form = Donation::defaultForm();
$form->process($_POST)->send();
