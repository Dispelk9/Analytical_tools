import io
import logging
import sys

import matplotlib.pyplot as plt
import numpy as np
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel


load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

router = APIRouter(tags=["math"])


class CollisionRequest(BaseModel):
    x: list[float] | list[int] | None = None
    y: list[float] | list[int] | None = None


@router.post("/api/collision")
def collision_plot(payload: CollisionRequest):
    x = payload.x
    y = payload.y
    logging.info(x)
    logging.info(y)

    if not isinstance(x, list) or not isinstance(y, list):
        raise HTTPException(status_code=400, detail="Both 'x' and 'y' must be lists")
    if len(x) != len(y):
        raise HTTPException(status_code=400, detail="'x' and 'y' lists must have the same length")

    try:
        x_values = np.array(x, dtype=float)
        y_values = np.array(y, dtype=float)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Lists 'x' and 'y' must contain numbers") from exc

    fig, ax = plt.subplots()
    ax.scatter(x_values, y_values, color="blue")
    ax.set_xlabel("Concentration (µg/mL)")
    ax.set_ylabel("Response")
    ax.set_title("Concentration vs Response")

    buffer = io.BytesIO()
    plt.savefig(buffer, format="png")
    plt.close(fig)
    buffer.seek(0)

    return Response(
        content=buffer.getvalue(),
        media_type="image/png",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        },
    )
