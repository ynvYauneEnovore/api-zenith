FROM debian:bookworm-slim
WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY zenith-agent .
RUN chmod +x zenith-agent

CMD ["./zenith-agent"]