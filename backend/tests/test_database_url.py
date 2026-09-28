from sqlalchemy import create_engine

from main import build_database_url, resolve_database_url


DB_ENV = {
    "DB_USERNAME": "user",
    "DB_PASSWORD": "secret",
    "DB_HOST": "postgres",
    "DB_PORT": "5432",
    "DB_NAME": "analytical",
}


def set_db_env(monkeypatch):
    for key, value in DB_ENV.items():
        monkeypatch.setenv(key, value)


def test_build_database_url_pins_psycopg2_driver(monkeypatch):
    set_db_env(monkeypatch)

    assert build_database_url() == "postgresql+psycopg2://user:secret@postgres:5432/analytical"


def test_database_url_creates_engine_with_installed_driver(monkeypatch):
    # create_engine imports the DBAPI driver without connecting, so this fails
    # if the URL resolves to a driver that isn't in requirements.txt.
    set_db_env(monkeypatch)

    engine = create_engine(resolve_database_url(None))

    assert engine.dialect.driver == "psycopg2"
    engine.dispose()


def test_resolve_database_url_is_none_without_db_env(monkeypatch):
    for key in DB_ENV:
        monkeypatch.delenv(key, raising=False)

    assert resolve_database_url(None) is None
