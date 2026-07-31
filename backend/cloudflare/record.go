package cloudflare

import (
	"context"
	"fmt"

	"github.com/cloudflare/cloudflare-go/v7"
	"github.com/cloudflare/cloudflare-go/v7/dns"
)

func (c *CloudflareService) CreateRecord(ctx context.Context, hostname string) error {
	name := fmt.Sprintf("%s.%s", hostname, c.baseDomain)
	_, err := c.cli.DNS.Records.New(ctx, dns.RecordNewParams{
		ZoneID: cloudflare.String(c.zoneID),
		Body: dns.CNAMERecordParam{
			Name:    cloudflare.String(name),
			Content: cloudflare.String(c.tunnelID + ".cfargotunnel.com"),
			Proxied: cloudflare.Bool(true),
			Type:    cloudflare.F(dns.CNAMERecordTypeCNAME),
		},
	})
	if err != nil {
		return err
	}

	return nil
}

func (c *CloudflareService) DeleteRecord(ctx context.Context, hostname string) error {
	name := fmt.Sprintf("%s.%s", hostname, c.baseDomain)
	res, err := c.cli.DNS.Records.List(ctx, dns.RecordListParams{
		ZoneID: cloudflare.String(c.zoneID),
	})
	if err != nil {
		return err
	}

	records := res.Result
	record := dns.RecordResponse{}

	for _, r := range records {
		if r.Name == name {
			record = r
			break
		}
	}

	if record.ID == "" {
		return nil
	}

	c.cli.DNS.Records.Delete(ctx, record.ID, dns.RecordDeleteParams{
		ZoneID: cloudflare.String(c.zoneID),
	})

	return nil
}
