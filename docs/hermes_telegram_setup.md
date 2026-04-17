# Hermes Telegram Setup

This repository already runs Hermes inside Docker. Telegram support only needs bot credentials added to the existing `hermes` service. No extra Telegram container is required.

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

## Verification

Check that Hermes received the Telegram config:

```bash
docker compose exec hermes sh -lc 'env | sort | grep -E "TELEGRAM|HERMES"'
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

## Group Chat Note

Telegram bots default to privacy mode. In groups, Hermes may only see commands and replies unless you disable privacy mode in BotFather or make the bot an admin.
