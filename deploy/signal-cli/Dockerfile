FROM eclipse-temurin:21-jre-jammy

ARG SIGNAL_CLI_VERSION=0.13.24

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl tini \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL -o /tmp/signal-cli.tar.gz \
      "https://github.com/AsamK/signal-cli/releases/download/v${SIGNAL_CLI_VERSION}/signal-cli-${SIGNAL_CLI_VERSION}.tar.gz" \
    && mkdir -p /opt \
    && tar -xzf /tmp/signal-cli.tar.gz -C /opt \
    && ln -s "/opt/signal-cli-${SIGNAL_CLI_VERSION}/bin/signal-cli" /usr/local/bin/signal-cli \
    && rm -f /tmp/signal-cli.tar.gz

COPY entrypoint.sh /usr/local/bin/signal-cli-entrypoint

RUN chmod +x /usr/local/bin/signal-cli-entrypoint

ENV SIGNAL_CLI_CONFIG_DIR=/home/.local/share/signal-cli
ENV SIGNAL_CLI_HTTP_HOST=0.0.0.0
ENV SIGNAL_CLI_HTTP_PORT=8080

EXPOSE 8080

ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/signal-cli-entrypoint"]
