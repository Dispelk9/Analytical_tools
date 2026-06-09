def test_metrics_endpoint_exposes_backend_request_metrics(client):
    client.get("/openapi.json")

    response = client.get("/metrics")

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/plain")
    assert "analytical_tools_http_requests_total" in response.text
    assert 'method="GET"' in response.text
    assert 'path="/openapi.json"' in response.text
