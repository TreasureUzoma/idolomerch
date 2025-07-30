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
	"path/filepath"

	"github.com/joho/godotenv"
)


func init() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file in handlers/auth.go")
	}
}

// UploadFileToCloudinary uploads a raw image file to Cloudinary and returns its secure URL.
func UploadFileToCloudinary(file *multipart.FileHeader) (string, error) {
	url := fmt.Sprintf("https://api.cloudinary.com/v1_1/%s/image/upload", os.Getenv("CLOUDINARY_CLOUD_NAME"))
	payload := &bytes.Buffer{}
	writer := multipart.NewWriter(payload)

	_ = writer.WriteField("upload_preset", os.Getenv("CLOUDINARY_UPLOAD_PRESET"))

	part, err := writer.CreateFormFile("file", filepath.Base(file.Filename))
	if err != nil {
		return "", err
	}

	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	if _, err := io.Copy(part, src); err != nil {
		return "", err
	}
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

	if resp.StatusCode >= 400 {
		respBody, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("Cloudinary upload failed: %s", string(respBody))
	}

	var result struct {
		SecureURL string `json:"secure_url"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	return result.SecureURL, nil
}

// TODO: fix n refactor
func DeleteImageFromCloudinary(publicID string) error {
	url := fmt.Sprintf("https://api.cloudinary.com/v1_1/%s/image/destroy", os.Getenv("CLOUDINARY_CLOUD_NAME"))

	payload := &bytes.Buffer{}
	writer := multipart.NewWriter(payload)

	_ = writer.WriteField("public_id", publicID)
	_ = writer.WriteField("upload_preset", "ml_default")
	writer.Close()

	req, err := http.NewRequest("POST", url, payload)
	if err != nil {
		return err
	}
	req.SetBasicAuth(os.Getenv("CLOUDINARY_API_KEY"), os.Getenv("CLOUDINARY_API_SECRET"))
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("Cloudinary error: %s", string(body))
	}

	return nil
}
