<?php
if (file_exists(__DIR__ . '/mailer.local.php')) {
    return require __DIR__ . '/mailer.local.php';
}

return Swift_Mailer::newInstance(Swift_NullTransport::newInstance());