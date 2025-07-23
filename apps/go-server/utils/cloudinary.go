package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file in handlers/auth.go")
	}
}

func UploadBase64ToCloudinary(base64Str string) (string, error) {
	url := fmt.Sprintf("https://api.cloudinary.com/v1_1/%s/image/upload", os.Getenv("CLOUDINARY_CLOUD_NAME"))
	payload := &bytes.Buffer{}
	writer := multipart.NewWriter(payload)

	// Cloudinary expects base64 as: data:image/png;base64,...
	_ = writer.WriteField("file", base64Str)
	_ = writer.WriteField("upload_preset", "ml_default") // or your preset
	writer.Close()

	req, err := http.NewRequest("POST", url, payload)
	if err != nil {
		return "", err
	}
	req.SetBasicAuth(os.Getenv("CLOUDINARY_API_KEY"), os.Getenv("CLOUDINARY_API_SECRET"))
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var result struct {
		SecureURL string `json:"secure_url"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}

	return result.SecureURL, nil
}
