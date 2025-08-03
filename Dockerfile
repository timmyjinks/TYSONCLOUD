FROM oven/bun 
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "build/index.js"]
