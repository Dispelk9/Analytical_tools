import os


def get_handbook_root() -> str:
    return os.getenv("HANDBOOK_ROOT", "/data/vho-handbook")
