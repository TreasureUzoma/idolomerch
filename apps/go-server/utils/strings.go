package utils

import (
	"fmt"
	"strings"
)

func ToString(value interface{}) string {
	switch v := value.(type) {
	case string:
		return v
	case float64:
		return fmt.Sprintf("%.2f", v)
	case int, int64:
		return fmt.Sprintf("%v", v)
	case []string:
		return strings.Join(v, " ")
	case []interface{}:
		parts := []string{}
		for _, item := range v {
			parts = append(parts, ToString(item))
		}
		return strings.Join(parts, " ")
	default:
		return ""
	}
}
