<?php
namespace Conreje\Contribua;

final class Message
{
    /**
     * @var array
     */
    private $from;

    /**
     * @var array
     */
    private $to;

    /**
     * @var array
     */
    private $replyTo;

    /**
     * @var string
     */
    private $subject;

    /**
     * @var string
     */
    private $body;

    /**
     * @var string
     */
    private $contentType;

    private function __construct() {}

    public static function plainText($subject, $body, array $to, array $from, array $replyTo = null)
    {
        $message = new self();
        $message->subject = $subject;
        $message->body = $body;
        $message->contentType = 'text/plain';
        $message->to = $to;
        $message->from = $from;
        $message->replyTo = $replyTo;

        return $message;
    }

    /**
     * @return array
     */
    public function getFrom()
    {
        return $this->from;
    }

    /**
     * @return array
     */
    public function getTo()
    {
        return $this->to;
    }

    /**
     * @return array
     */
    public function getReplyTo()
    {
        return $this->replyTo;
    }

    /**
     * @return string
     */
    public function getSubject()
    {
        return $this->subject;
    }

    /**
     * @return string
     */
    public function getBody()
    {
        return $this->body;
    }

    /**
     * @return string
     */
    public function getContentType()
    {
        return $this->contentType;
    }
}
