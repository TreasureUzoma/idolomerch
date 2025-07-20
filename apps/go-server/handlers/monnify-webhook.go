package handlers

import (
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/treasureuzoma/idolomerch-api/db"
)

var (
	clientSecret  = os.Getenv("MONNIFY_CLIENT_SECRET")
	monnifyIP     = "35.242.133.146"
	telegramToken = os.Getenv("TELEGRAM_BOT_TOKEN")
	chatID        = os.Getenv("TELEGRAM_CHAT_ID")
)

type WebhookPayload struct {
	EventType string          `json:"eventType"`
	EventData json.RawMessage `json:"eventData"`
}

type EventData struct {
	TransactionReference string  `json:"transactionReference"`
	PaymentReference     string  `json:"paymentReference"`
	AmountPaid           float64 `json:"amountPaid"`
	CustomerName         string  `json:"customerName"`
	CustomerEmail        string  `json:"customerEmail"`
	ProductID            string  `json:"productId"`
	Quantity             int     `json:"quantity"`
}

func init() {
	// crash early if env variables are not set
	if clientSecret == "" || telegramToken == "" || chatID == "" {
		log.Fatal("One or more required environment variables are missing.")
	}
}

func MonnifyWebhook(c *fiber.Ctx) error {
	ip := c.IP()
	if !isAllowedIP(ip) {
		log.Println("Blocked IP:", ip)
		return c.Status(fiber.StatusForbidden).SendString("Unauthorized IP")
	}

	body := c.Body()
	signature := c.Get("monnify-signature")

	if !isValidSignature(body, signature) {
		log.Println("Invalid signature from IP:", ip)
		return c.Status(fiber.StatusBadRequest).SendString("Invalid signature")
	}

	var payload WebhookPayload
	if err := json.Unmarshal(body, &payload); err != nil {
		log.Println("Webhook JSON unmarshal failed:", err)
		return c.Status(fiber.StatusBadRequest).SendString("Invalid payload")
	}

	// Respond fast
	go processWebhook(payload)

	return c.SendStatus(fiber.StatusOK)
}

func isAllowedIP(ip string) bool {
	// Handle IPv6 loopback or localhost
	if ip == "::1" || strings.HasPrefix(ip, "127.") {
		return true
	}

	// Strip port if needed
	host, _, err := net.SplitHostPort(ip)
	if err == nil {
		ip = host
	}

	return ip == monnifyIP
}

func isValidSignature(body []byte, sentSignature string) bool {
	h := hmac.New(sha512.New, []byte(clientSecret))
	h.Write(body)
	expected := hex.EncodeToString(h.Sum(nil))
	return strings.EqualFold(expected, sentSignature)
}

func processWebhook(payload WebhookPayload) {
	if payload.EventType != "SUCCESSFUL_TRANSACTION" {
		log.Println("Ignoring event type:", payload.EventType)
		return
	}

	var data EventData
	if err := json.Unmarshal(payload.EventData, &data); err != nil {
		log.Println("Error decoding event data:", err)
		return
	}

	// Optional: check product exists
	if !isValidProduct(data.ProductID) {
		log.Println("Invalid product:", data.ProductID)
		return
	}

	// Prevent double insert
	if isDuplicateTransaction(data.TransactionReference) {
		log.Println("Duplicate transaction:", data.TransactionReference)
		return
	}

	// Insert order
	if err := saveOrderToDB(data); err != nil {
		log.Println("DB insert failed:", err)
		return
	}

	// Telegram alert
	sendToTelegram(data)
}

func isDuplicateTransaction(ref string) bool {
	var exists bool
	err := db.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM orders WHERE transaction_ref = $1)`, ref).Scan(&exists)
	if err != nil {
		log.Println("Duplicate check failed:", err)
		return false
	}
	return exists
}

func isValidProduct(productID string) bool {
	var exists bool
	err := db.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM products WHERE id = $1)`, productID).Scan(&exists)
	if err != nil {
		log.Println("Product check error:", err)
		return false
	}
	return exists
}

func saveOrderToDB(data EventData) error {
	query := `
		INSERT INTO orders (
			transaction_ref, payment_ref, product_id,
			customer_name, customer_email, amount_paid, quantity
		) VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT (transaction_ref) DO NOTHING
	`
	_, err := db.DB.Exec(query,
		data.TransactionReference,
		data.PaymentReference,
		data.ProductID,
		data.CustomerName,
		data.CustomerEmail,
		data.AmountPaid,
		data.Quantity,
	)
	return err
}

func sendToTelegram(data EventData) {
	message := fmt.Sprintf(
		"💸 *New Payment Received!*\n\n👤 *Name:* %s\n📧 *Email:* %s\n💰 *Amount:* ₦%.2f\n📦 *Product ID:* %s\n🔖 *Ref:* %s",
		data.CustomerName,
		data.CustomerEmail,
		data.AmountPaid,
		data.ProductID,
		data.TransactionReference,
	)

	url := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", telegramToken)

	resp, err := http.PostForm(url, url.Values{
		"chat_id":    {chatID},
		"text":       {message},
		"parse_mode": {"Markdown"},
	})
	if err != nil {
		log.Println("Telegram send error:", err)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	log.Println("Telegram response:", string(body))
}
