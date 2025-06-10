#checking which port is open 25, 465 or 587
#if open 25, test using smtp
#if open 465, test using smtps
#if open 587, test using smtptls

import socket
import ssl
import smtplib
import sys

def is_port_open(host, port, timeout=5):
    """Return True if TCP connect to (host, port) succeeds."""
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except Exception:
        return False

def test_smtp(host, port=25):
    """Test plain SMTP and opportunistic STARTTLS upgrade."""
    result = {
        "port": port,
        "service": "SMTP",
        "open": True,
        "noop_response": None,
        "starttls_supported": False,
        "starttls_result": None
    }
    try:
        with smtplib.SMTP(host=host, port=port, timeout=10) as smtp:
            smtp.set_debuglevel(0)
            smtp.ehlo()
            code, msg = smtp.noop()
            result["noop_response"] = f"{code} {msg.decode().strip()}"
            if smtp.has_extn("STARTTLS"):
                result["starttls_supported"] = True
                try:
                    smtp.starttls(context=ssl.create_default_context())
                    smtp.ehlo()
                    code2, msg2 = smtp.noop()
                    result["starttls_result"] = f"Succeeded: {code2} {msg2.decode().strip()}"
                except Exception as e:
                    result["starttls_result"] = f"Failed: {e}"
    except Exception as e:
        result["open"] = False
        result["error"] = str(e)
    return result

def test_smtps(host, port=465):
    """Test implicit-TLS SMTP (SMTPS)."""
    result = {
        "port": port,
        "service": "SMTPS",
        "open": True,
        "noop_response": None,
        "error": None
    }
    try:
        with smtplib.SMTP_SSL(host=host, port=port, timeout=10) as smtp:
            smtp.set_debuglevel(0)
            code, msg = smtp.noop()
            result["noop_response"] = f"{code} {msg.decode().strip()}"
    except Exception as e:
        result["open"] = False
        result["error"] = str(e)
    return result

def test_smtptls(host, port=587):
    """Test explicit-TLS SMTP via STARTTLS."""
    result = {
        "port": port,
        "service": "SMTPTLS",
        "open": True,
        "starttls_supported": False,
        "starttls_result": None,
        "noop_response": None,
        "error": None
    }
    try:
        with smtplib.SMTP(host=host, port=port, timeout=10) as smtp:
            smtp.set_debuglevel(0)
            smtp.ehlo()
            if smtp.has_extn("STARTTLS"):
                result["starttls_supported"] = True
                smtp.starttls(context=ssl.create_default_context())
                smtp.ehlo()
                code, msg = smtp.noop()
                result["noop_response"] = f"{code} {msg.decode().strip()}"
                result["starttls_result"] = "Succeeded"
            else:
                result["starttls_result"] = "Not supported"
    except Exception as e:
        result["open"] = False
        result["error"] = str(e)
    return result

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <mail-server-hostname-or-ip>")
        sys.exit(1)

    host = sys.argv[1]
    checks = []

    for port, func in [(25, test_smtp), (465, test_smtps), (587, test_smtptls)]:
        if is_port_open(host, port):
            checks.append(func(host, port))
        else:
            service_name = func.__doc__.split()[1]
            checks.append({"port": port, "service": service_name, "open": False})

    # Detailed per-port output
    print(f"\nPort scan results for {host}:")
    for res in checks:
        status = "open" if res.get("open") else "closed"
        print(f"\nPort {res['port']} ({res['service']}): {status}")
        if not res.get("open"):
            if res.get("error"):
                print(f"  Error: {res['error']}")
            continue
        if res['service'] == "SMTP":
            print(f"  NOOP response: {res['noop_response']}")
            print(f"  STARTTLS supported: {res['starttls_supported']}")
            print(f"  Opportunistic TLS upgrade: {res['starttls_result']}")
        elif res['service'] == "SMTPS":
            print(f"  NOOP over SMTPS: {res['noop_response']}")
        elif res['service'] == "SMTPTLS":
            print(f"  STARTTLS supported: {res['starttls_supported']}")
            print(f"  NOOP over SMTPTLS: {res['noop_response']}")
            print(f"  Upgrade result: {res['starttls_result']}")

    # Summary output
    print("\nSummary:")
    for res in checks:
        port = res['port']
        service = res['service']
        if not res['open']:
            summary_status = "NOT WORKING"
        else:
            if service == "SMTP":
                summary_status = "OK"
            elif service == "SMTPS":
                summary_status = "OK"
            elif service == "SMTPTLS":
                summary_status = "OK" if res.get("starttls_supported") else "NOT WORKING"
        print(f"- port {port}: {summary_status}")
