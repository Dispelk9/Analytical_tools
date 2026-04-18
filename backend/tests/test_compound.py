from types import SimpleNamespace


def test_compound_requires_payload_keys(client):
    response = client.post("/api/compound", json={"AD": "1"})

    assert response.status_code == 400
    assert response.json() == {"error": "Missing one or more numbers"}


def test_compound_returns_compounds_and_duplicates(client, monkeypatch):
    class FakeResponse:
        status_code = 200
        text = "{}"

        def raise_for_status(self):
            return None

        def json(self):
            return {"IdentifierList": {"CID": [101, 102]}}

    def fake_from_cid(cid):
        return SimpleNamespace(
            molecular_formula="C2H6O",
            exact_mass=46.04,
            iupac_name=f"name-{cid}",
        )

    monkeypatch.setattr("api.tools.compound.requests.get", lambda *args, **kwargs: FakeResponse())
    monkeypatch.setattr("api.tools.compound.pcp.Compound.from_cid", fake_from_cid)
    monkeypatch.setattr("api.tools.compound.time.sleep", lambda *_: None)

    response = client.post("/api/compound", json={"AD": "1.5", "OB": "100", "ME": "5"})

    assert response.status_code == 200
    payload = response.json()
    assert [item["cid"] for item in payload["compounds"]] == [101, 102]
    assert payload["duplicates"] == {"C2H6O": 2}
