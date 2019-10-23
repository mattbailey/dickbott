package main

import (
	"os"

	"github.com/go-chat-bot/bot/slack"
	_ "github.com/mattbailey/dickbott/plugins/botsnack"
)

func main() {
	slack.Run(os.Getenv("SLACK_TOKEN"))
}
