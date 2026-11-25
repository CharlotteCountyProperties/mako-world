#!/usr/bin/env python3
"""Load Mako's World over http, file://, and ?level=3; record canvas presence plus console/page errors."""

from __future__ import annotations

import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

HTTP_URL = "http://localhost:8080"
FILE_URL = Path("/workspace/game-desk/index.html").resolve().as_uri()
LEVEL3_URL = "http://localhost:8080/?level=3"
SCREENSHOT = Path("/workspace/game-desk/check-screenshot.png")
LEVEL3_SHOT = Path("/workspace/game-desk/check-screenshot-level3.png")
WAIT_SECONDS = 3


def check_page(page, url: str) -> tuple[bool, list[str], list[str]]:
    console_errors: list[str] = []
    page_errors: list[str] = []

    def on_console(msg):
        if msg.type == "error":
            console_errors.append(msg.text)

    def on_page_error(err):
        page_errors.append(str(err))

    page.on("console", on_console)
    page.on("pageerror", on_page_error)

    wait = "networkidle" if url.startswith("http") else "load"
    page.goto(url, wait_until=wait, timeout=15000)
    page.wait_for_timeout(int(WAIT_SECONDS * 1000))

    canvas_found = page.query_selector("canvas") is not None

    page.remove_listener("console", on_console)
    page.remove_listener("pageerror", on_page_error)

    return canvas_found, console_errors, page_errors


def main() -> int:
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 720})

        http_found, http_console, http_page = check_page(page, HTTP_URL)
        SCREENSHOT.parent.mkdir(parents=True, exist_ok=True)
        page.screenshot(path=str(SCREENSHOT), full_page=True)
        results.append(("http", HTTP_URL, http_found, http_console, http_page, str(SCREENSHOT)))

        file_found, file_console, file_page = check_page(page, FILE_URL)
        results.append(("file", FILE_URL, file_found, file_console, file_page, None))

        l3_found, l3_console, l3_page = check_page(page, LEVEL3_URL)
        page.screenshot(path=str(LEVEL3_SHOT), full_page=True)
        results.append(("http-level3", LEVEL3_URL, l3_found, l3_console, l3_page, str(LEVEL3_SHOT)))

        browser.close()

    total = 0
    all_canvas = True
    for label, url, found, console_errors, page_errors, shot in results:
        count = len(console_errors) + len(page_errors)
        total += count
        all_canvas = all_canvas and found
        print(f"=== {label} ===")
        print("url:", url)
        print("canvas_found:", "yes" if found else "no")
        print("console_errors:", len(console_errors))
        print("page_errors:", len(page_errors))
        print("subtotal_errors:", count)
        if shot:
            print("screenshot:", shot)
        if console_errors:
            print("console_error_details:")
            for item in console_errors:
                print(" -", item)
        if page_errors:
            print("page_error_details:")
            for item in page_errors:
                print(" -", item)

    print("=== summary ===")
    print("canvas_found_http:", "yes" if results[0][2] else "no")
    print("canvas_found_file:", "yes" if results[1][2] else "no")
    print("canvas_found_http_level3:", "yes" if results[2][2] else "no")
    print("total_errors:", total)
    print("screenshot:", str(SCREENSHOT))
    print("screenshot_level3:", str(LEVEL3_SHOT))

    return 0 if total == 0 and all_canvas else 1


if __name__ == "__main__":
    sys.exit(main())
