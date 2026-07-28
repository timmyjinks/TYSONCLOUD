package cloudflare

import (
	"github.com/cloudflare/cloudflare-go/v7"
	"github.com/cloudflare/cloudflare-go/v7/option"
)

type CloudflareService struct {
	cli        *cloudflare.Client
	accountID  string
	tunnelID   string
	zoneID     string
	baseDomain string
}

func NewCloudflareService(apiToken, accountId, tunnelId, zoneId, baseDomain string) *CloudflareService {
	cli := cloudflare.NewClient(option.WithAPIToken(apiToken))

	return &CloudflareService{
		cli:        cli,
		accountID:  accountId,
		tunnelID:   tunnelId,
		zoneID:     zoneId,
		baseDomain: baseDomain,
	}
}
