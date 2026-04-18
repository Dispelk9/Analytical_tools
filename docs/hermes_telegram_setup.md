# Hermes Telegram Setup

This repository already runs Hermes inside Docker. Telegram support now uses a dedicated backend polling worker, so handbook retrieval happens before the prompt is sent to Hermes and the backend API does not need to be exposed publicly for Telegram callbacks.

Current flow:

```text
Telegram
-> backend polling worker
-> compact handbook retrieval
-> Hermes
-> Telegram reply
```

Hermes also reads the synced handbook/text volume directly at `/workspace/handbook`, while the backend and polling worker read the same synced repository from `HANDBOOK_ROOT`.

## Required Environment Variables

The backend reads these from the Compose-level `.env`:

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

Check that the backend and polling worker received the Telegram config:

```bash
docker compose exec backend sh -lc 'env | sort | grep -E "TELEGRAM|HERMES|HANDBOOK"'
docker compose exec telegram-poller sh -lc 'env | sort | grep -E "TELEGRAM|HERMES|HANDBOOK"'
```

Check that the handbook/text files are visible inside Hermes:

```bash
docker compose exec hermes sh -lc 'pwd && find /workspace/handbook -type f | head -50'
```

Expected values:

```text
HANDBOOK_ROOT=/data/vho-handbook
TELEGRAM_BOT_TOKEN=...
TELEGRAM_ALLOWED_USERS=123456789
```

Check backend to Hermes:

```bash
curl http://localhost:8080/health/hermes
```

Check that handbook/text files are visible inside both services:

```bash
docker compose exec backend sh -lc 'find /data/vho-handbook -type f | head -50'
docker compose exec hermes sh -lc 'find /workspace/handbook -type f | head -50'
```

Then watch the polling worker and Hermes logs together:

```bash
docker compose logs -f telegram-poller hermes
```

## Prove It Is Using Handbook Then Hermes

If Telegram is replying, you can verify that the reply is coming through Hermes with this sequence:

1. Check Hermes health through the backend:

```bash
curl http://localhost:8080/health/hermes
```

2. Watch the polling worker and Hermes logs in one terminal:

```bash
docker compose logs -f telegram-poller hermes
```

3. Send a fresh Telegram message to the bot.

4. Confirm the polling worker logs show it handling a fresh update.

5. Confirm Hermes logs show a fresh `/v1/responses` call close to the message timestamp.

6. Ask a question containing a very specific handbook keyword such as `BlueCat DDI` and check that the answer reflects the matching handbook snippet rather than a generic model answer.

7. Optionally stop Hermes briefly and confirm Telegram replies stop:

```bash
docker compose stop hermes
```

Send the bot another message. It should stop replying while Hermes is down.

Bring Hermes back:

```bash
docker compose up -d hermes
```

That is the clearest practical proof that Telegram is flowing through backend retrieval first and then through Hermes for answer generation.

## Troubleshooting

### Bot does not reply at all

Check Hermes logs first:

```bash
docker compose logs telegram-poller hermes --tail=200
```

Common causes:

- `TELEGRAM_BOT_TOKEN` is missing or invalid
- `TELEGRAM_ALLOWED_USERS` does not contain your numeric Telegram user ID
- polling worker was not recreated after env changes

Recreate backend, polling worker, and Hermes after changing Telegram secrets:

```bash
docker compose up -d --force-recreate backend telegram-poller hermes
```

### Another consumer is draining Telegram updates

Polling uses `getUpdates`, so only one consumer should read the bot queue. If another process or script is also calling `getUpdates`, the worker may appear idle.

Stop any ad-hoc `getUpdates` scripts before testing the poller.

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
curl http://localhost:8080/health/telegram
docker compose logs telegram-poller --tail=200
docker compose logs hermes --tail=200
```

If Hermes is unhealthy, Telegram will not reply even if the bot token is valid.

### Group chat messages are ignored

Telegram bots default to privacy mode. In groups, Hermes may only see commands and replies unless you disable privacy mode in BotFather or make the bot an admin.

### Token was exposed

If the bot token was pasted into a terminal log, chat, or screenshot, rotate it in `@BotFather` and update:

- GitHub Actions secret `TELEGRAM_BOT_TOKEN`
- local or server `.env` if you set it manually
