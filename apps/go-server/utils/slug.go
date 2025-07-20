package utils

import (
	"regexp"
	"strings"
)

func GenerateSlug(input string) string {
	// firstly, make it be in lowercase
	slug := strings.ToLower(input)

	// replace spaces and underscores with dashes
	slug = strings.ReplaceAll(slug, " ", "-")
	slug = strings.ReplaceAll(slug, "_", "-")

	// remove all non-alphanumeric characters except dashes
	reg := regexp.MustCompile("[^a-z0-9-]")
	slug = reg.ReplaceAllString(slug, "")

	// trim extra dashes
	slug = strings.Trim(slug, "-")

	return slug
}
