import os
import time
from collections.abc import Awaitable, Callable

from fastapi import FastAPI, Request, Response
from prometheus_client import (
    CONTENT_TYPE_LATEST,
    REGISTRY,
    CollectorRegistry,
    Counter,
    Histogram,
    generate_latest,
    multiprocess,
)
from starlette.responses import Response as StarletteResponse


METRICS_PATH = "/metrics"

REQUEST_COUNT = Counter(
    "analytical_tools_http_requests_total",
    "Total HTTP requests handled by the backend.",
    ["method", "path", "status_code"],
)
REQUEST_DURATION = Histogram(
    "analytical_tools_http_request_duration_seconds",
    "Backend HTTP request duration in seconds.",
    ["method", "path"],
)


def get_request_path(request: Request) -> str:
    route = request.scope.get("route")
    return getattr(route, "path", request.url.path)


def collect_metrics() -> bytes:
    multiprocess_dir = os.getenv("PROMETHEUS_MULTIPROC_DIR")
    if multiprocess_dir and os.path.isdir(multiprocess_dir):
        registry = CollectorRegistry()
        multiprocess.MultiProcessCollector(registry)
        return generate_latest(registry)

    return generate_latest(REGISTRY)


def configure_metrics(app: FastAPI) -> None:
    @app.middleware("http")
    async def prometheus_metrics_middleware(
        request: Request,
        call_next: Callable[[Request], Awaitable[StarletteResponse]],
    ) -> StarletteResponse:
        if request.url.path == METRICS_PATH:
            return await call_next(request)

        start_time = time.perf_counter()
        response = None

        try:
            response = await call_next(request)
            return response
        finally:
            duration = time.perf_counter() - start_time
            path = get_request_path(request)
            status_code = str(response.status_code) if response else "500"

            REQUEST_COUNT.labels(
                method=request.method,
                path=path,
                status_code=status_code,
            ).inc()
            REQUEST_DURATION.labels(
                method=request.method,
                path=path,
            ).observe(duration)

    @app.get(METRICS_PATH, include_in_schema=False)
    def metrics() -> Response:
        return Response(content=collect_metrics(), media_type=CONTENT_TYPE_LATEST)
