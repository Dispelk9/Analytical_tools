def test_adduct_requires_required_fields(client):
    response = client.post("/api/adduct", json={"NM": "100"})

    assert response.status_code == 400
    assert response.get_json() == {"error": "Missing one or more numbers"}


def test_adduct_returns_combined_results_and_sends_email(client, monkeypatch):
    monkeypatch.setattr("adduct.DB_CONNECT", lambda: {"username": "u"})
    monkeypatch.setattr("adduct.without_hydro", lambda value_list, db_config: [{"Element Set": ["Na+"], "Sum": ["22.99"]}])
    monkeypatch.setattr("adduct.m_calculation", lambda value_list, db_config: [{"Adduct Combinations": [["H+"]]}])
    sent_emails = []
    monkeypatch.setattr("adduct.send_email", lambda logs, recipient: sent_emails.append((logs, recipient)))

    response = client.post(
        "/api/adduct",
        json={"NM": "100.5", "OB": "122.1", "ME": "5", "operation": "positive", "Email": "lab@example.com"},
    )

    assert response.status_code == 200
    assert response.get_json() == {
        "result": {
            "Results without Hydro": [{"Element Set": ["Na+"], "Sum": ["22.99"]}],
            "Results with Hydro": [{"Adduct Combinations": [["H+"]]}],
        }
    }
    assert sent_emails[0][1] == "lab@example.com"
