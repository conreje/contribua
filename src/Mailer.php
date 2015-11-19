<?php
namespace Conreje\Contribua;

use Swift_Mailer;
use Swift_Message;

final class Mailer
{
    /**
     * @var Swift_Mailer
     */
    private $handler;

    /**
     * @param Swift_Mailer $handler
     */
    public function __construct(Swift_Mailer $handler)
    {
        $this->handler = $handler;
    }

    /**
     * @return self
     */
    public static function defaultMailer()
    {
        return new self(require __DIR__ . '/../config/mailer.php');
    }

    /**
     * @param Message $message
     *
     * @return bool
     */
    public function send(Message $message)
    {
        return $this->handler->send($this->convertMessage($message)) > 0;
    }

    /**
     * @param Message $message
     *
     * @return Swift_Message
     */
    private function convertMessage(Message $message)
    {
        $newMessage = Swift_Message::newInstance($message->getSubject())
            ->setBody($message->getBody(), $message->getContentType(), 'UTF-8')
            ->setFrom($message->getFrom())
            ->setTo($message->getTo());

        if ($replyTo = $message->getReplyTo()) {
            $newMessage->setReplyTo($replyTo);
        }

        return $newMessage;
    }
}
