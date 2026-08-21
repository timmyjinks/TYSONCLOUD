FROM golang:1.26 AS builder
WORKDIR /src

COPY go.sum go.mod ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o /bin/deploy ./cmd/deploy

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=builder /bin/deploy /bin/deploy

EXPOSE 8080

CMD ["/bin/deploy"]
