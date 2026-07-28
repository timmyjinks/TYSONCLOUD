package config

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Server     Server
	Supabase   Supabase
	Cloudflare Cloudflare
	KubeConfig string `env:"KUBECONFIG"`
}

type Cloudflare struct {
	AccountID  string `env:"CLOUDFLARE_ACCOUNT_ID"`
	ZoneID     string `env:"CLOUDFLARE_ZONE_ID"`
	TunnelID   string `env:"CLOUDFLARE_TUNNEL_ID"`
	ApiToken   string `env:"CLOUDFLARE_API_TOKEN"`
	BaseDomain string `env:"CLOUDFLARE_BASE_DOMAIN"`
}

type Server struct {
	Addr           string `env:"ADDR"`
	AllowedOrigins string `env:"ALLOWED_ORIGINS"`
	ClerkApiKey    string `env:"CLERK_API_KEY"`
}

type Supabase struct {
	ProjectURL string `env:"SUPABASE_URL"`
	APIKey     string `env:"SUPABASE_API_KEY"`
}

func Load() (Config, error) {
	err := godotenv.Load()
	if err != nil {
		log.Println(err)
	}

	return Config{
		Server: Server{
			Addr:           getString("ADDR", ":8080"),
			AllowedOrigins: getString("ALLOWED_ORIGINS", "https://status.tysonjenkins.dev,https://tysoncloud.tysonjenkins.dev,https://tysoncloud-test.tysonjenkins.dev,http://localhost:3000"),
			ClerkApiKey:    getStringOrDie("CLERK_API_KEY"),
		},
		Supabase: Supabase{
			ProjectURL: getStringOrDie("SUPABASE_URL"),
			APIKey:     getStringOrDie("SUPABASE_API_KEY"),
		},
		Cloudflare: Cloudflare{
			AccountID:  getStringOrDie("CLOUDFLARE_ACCOUNT_ID"),
			ZoneID:     getStringOrDie("CLOUDFLARE_ZONE_ID"),
			TunnelID:   getStringOrDie("CLOUDFLARE_TUNNEL_ID"),
			ApiToken:   getStringOrDie("CLOUDFLARE_API_TOKEN"),
			BaseDomain: getString("CLOUDFLARE_BASE_DOMAIN", "tysoncloud.tysonjenkins.dev"),
		},
		KubeConfig: getStringOrDie("KUBECONFIG"),
	}, nil
}

func getString(key, fallback string) string {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	return val
}

func getStringOrDie(key string) string {
	val := os.Getenv(key)
	if val == "" {
		panic(fmt.Errorf("env is required for key: %s", key))
	}
	return val
}

func getInt(key string, fallback int) int {
	val := os.Getenv(key)
	i, err := strconv.Atoi(val)
	if err != nil {
		return fallback
	}
	return i
}
