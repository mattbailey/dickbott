package botsnack

import (
	"regexp"

	"github.com/go-chat-bot/bot"
)

const (
	pattern = "(?i)\\b(botsnack)\\b"
)

var (
	re = regexp.MustCompile(pattern)
)

func botSnack(command *bot.PassiveCmd) (string, error) {
	if !re.MatchString(command.Raw) {
		return "", nil
	}
	return "nomnomnom :hamburger:", nil
}

func init() {
	bot.RegisterPassiveCommand("botsnack", botSnack)
}
