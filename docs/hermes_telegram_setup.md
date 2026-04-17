# Hermes Telegram Setup

This repository already runs Hermes inside Docker. Telegram support only needs bot credentials added to the existing `hermes` service. No extra Telegram container is required.

Hermes also reads the synced handbook/text volume directly at `/workspace/handbook`, so Telegram-side Hermes searches can inspect the same text corpus that the backend handbook mode uses.

## Required Environment Variables

Hermes reads these from the Compose-level `.env`:

```env
TELEGRAM_BOT_TOKEN=123456789:your_bot_token
TELEGRAM_ALLOWED_USERS=123456789
```

In production, [act_cd.yml](/mnt/c/users/viethoang/downloads/vm_shared_folder/codebase/analytical_tools/.github/workflows/act_cd.yml:1) writes them into `~/app/.env` from GitHub Actions secrets.

## Create The Bot

1. Message `@BotFather` on Telegram.
2. Run `/newbot`.
3. Choose a display name.
4. Choose a username ending in `bot`.
5. Save the bot token.

To find your numeric Telegram user ID, message `@userinfobot`.

## GitHub Secrets

Add these secrets before deploying:

```env
TELEGRAM_BOT_TOKEN=123456789:your_bot_token
TELEGRAM_ALLOWED_USERS=123456789
```

## Deploy

Deploy normally through CI/CD, or refresh the running stack manually:

```bash
cd ~/app
docker compose up -d --remove-orphans --force-recreate
docker compose logs hermes --tail=100
```

If you changed handbook mounts or the Hermes config, recreate Hermes so it picks up the new working directory and mounts:

```bash
docker compose up -d --force-recreate hermes
```

## Verification

Check that Hermes received the Telegram config:

```bash
docker compose exec hermes sh -lc 'env | sort | grep -E "TELEGRAM|HERMES"'
```

Check that the handbook/text files are visible inside Hermes:

```bash
docker compose exec hermes sh -lc 'pwd && find /workspace/handbook -type f | head -50'
```

Expected values:

```text
TELEGRAM_BOT_TOKEN=...
TELEGRAM_ALLOWED_USERS=123456789
```

Check backend to Hermes:

```bash
curl http://localhost:8080/health/hermes
```

Then send the bot a direct message on Telegram and watch Hermes logs:

```bash
docker compose logs -f hermes
```

## Prove It Is Using Hermes

If Telegram is replying, you can verify that the reply is coming through Hermes with this sequence:

1. Check Hermes health through the backend:

```bash
curl http://localhost:8080/health/hermes
```

2. Watch Hermes logs in one terminal:

```bash
docker compose logs -f hermes
```

3. Send a fresh Telegram message to the bot.

4. Confirm Hermes logs show Telegram activity close to the message timestamp.

5. Optionally stop Hermes briefly and confirm Telegram replies stop:

```bash
docker compose stop hermes
```

Send the bot another message. It should stop replying while Hermes is down.

Bring Hermes back:

```bash
docker compose up -d hermes
```

That is the clearest practical proof that Telegram is flowing through Hermes rather than the Flask backend chat endpoint.

## Troubleshooting

### Bot does not reply at all

Check Hermes logs first:

```bash
docker compose logs hermes --tail=200
```

Common causes:

- `TELEGRAM_BOT_TOKEN` is missing or invalid
- `TELEGRAM_ALLOWED_USERS` does not contain your numeric Telegram user ID
- Hermes was not recreated after env changes

Recreate Hermes after changing Telegram secrets:

```bash
docker compose up -d --force-recreate hermes
```

### `getUpdates` is empty

If you are checking Telegram manually and this returns no updates:

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates"
```

Then:

1. Message your bot directly
2. Press `Start`
3. Send a plain text message like `hello`

If it is still empty, check webhook status:

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

If a webhook is set unexpectedly, clear it:

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook"
```

### Wrong allowed user value

`TELEGRAM_ALLOWED_USERS` must be the numeric Telegram user ID, not:

- phone number
- email address
- Telegram username

Example:

```env
TELEGRAM_ALLOWED_USERS=8638591553
```

### Hermes health is down

Check:

```bash
curl http://localhost:8080/health/hermes
docker compose logs hermes --tail=200
```

If Hermes is unhealthy, Telegram will not reply even if the bot token is valid.

### Group chat messages are ignored

Telegram bots default to privacy mode. In groups, Hermes may only see commands and replies unless you disable privacy mode in BotFather or make the bot an admin.

### Token was exposed

If the bot token was pasted into a terminal log, chat, or screenshot, rotate it in `@BotFather` and update:

- GitHub Actions secret `TELEGRAM_BOT_TOKEN`
- local or server `.env` if you set it manually
