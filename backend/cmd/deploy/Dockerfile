# syntax=docker/dockerfile:1.7
FROM golang:1.26 AS builder
WORKDIR /src

# Leverage BuildKit cache mounts for Go modules + build cache
# This keeps /go/pkg/mod and /root/.cache/go-build across builds
COPY --link go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download

COPY --link . .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 go build -trimpath -ldflags="-w -s" -o /bin/deploy ./cmd/deploy

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=builder /bin/deploy /bin/deploy

EXPOSE 8080

CMD ["/bin/deploy"]
