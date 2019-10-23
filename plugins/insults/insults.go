package insults

import (
	"log"
	"regexp"
	"time"

	"github.com/boltdb/bolt"
	"github.com/go-chat-bot/bot"
)

const (
	pattern = "(?i)\\b(botsnack)\\b"
)

var (
	re = regexp.MustCompile(pattern)
	db = &bolt.DB{}
)

func insult(command *bot.PassiveCmd) (string, error) {
	if !re.MatchString(command.Raw) {
		return "", nil
	}
	return "nomnomnom :hamburger:", nil
}

func initializeDatabase() error {
	var err error
	db, err = bolt.Open("db/insults.db", 0600, &bolt.Options{Timeout: 1 * time.Second})
	if err != nil {
		log.Fatal(err)
	}
	db.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte("words:insults"))
		if err != nil {
			return log.Fatal(err)
		}
		return err
	})
}

func init() {
	bot.RegisterPassiveCommand("insult", insult)
}
