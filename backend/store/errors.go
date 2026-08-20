package store

import (
	"fmt"
	"strings"
)

func rpcError(op string, pgErr PostgrestError) error {
	return fmt.Errorf("%s failed: %s", op, pgErr.Message)
}

func GetPostgresErrorMessage(msg string) (string, bool) {
	lower := strings.ToLower(msg)
	switch {
	case strings.Contains(lower, "duplicate key value"):
		return "That name is already in use. Pick a different one.", true
	case strings.Contains(lower, "violates check constraint"):
		return "One of the provided values isn't allowed.", true
	case strings.Contains(lower, "violates foreign key constraint"):
		return "That resource is linked to another resource and can't be changed.", true
	case strings.Contains(lower, "null value in column"):
		return "One of the required values is missing.", true
	case strings.Contains(lower, "value too long"):
		return "One of the values is too long.", true
	case strings.Contains(lower, "out of range"):
		return "One of the values is too large.", true
	case strings.Contains(lower, "permission denied"), strings.Contains(lower, "row-level security"):
		return "You don't have permission to do that.", true
	}
	return "", false
}