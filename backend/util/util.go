package util

import (
	"iter"
	"log"
	"net"
)

func Unwrap[T comparable](ok T, err error) T {
	if err != nil {
		panic(err)
	}

	return ok
}

func Enumerate[T any](cookieIndex *int, iterator iter.Seq[T]) iter.Seq2[int, T] {
	return func(yield func(int, T) bool) {
		for val := range iterator {
			if !yield(*cookieIndex, val) {
				return
			}
			*cookieIndex += 1
		}
	}
}

func GetLocalIP() string {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	localAddress := conn.LocalAddr().(*net.UDPAddr)
	return localAddress.String()
}
