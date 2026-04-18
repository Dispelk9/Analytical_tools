def test_collision_returns_png(client):
    response = client.post("/api/collision", json={"x": [1, 2], "y": [3, 4]})

    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert response.headers["Cache-Control"] == "no-cache, no-store, must-revalidate"


def test_collision_rejects_mismatched_lengths(client):
    response = client.post("/api/collision", json={"x": [1], "y": [3, 4]})

    assert response.status_code == 400
    assert response.json() == {"error": "'x' and 'y' lists must have the same length"}
