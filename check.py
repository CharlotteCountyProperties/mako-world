#!/usr/bin/env python3
"""Load Mako's World over http (default), file://, and http ?level=1..10.
Record canvas presence plus console/page errors for each load, and save screenshots."""

from __future__ import annotations

import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = "http://localhost:8080"
FILE_URL = Path("/workspace/game-desk/index.html").resolve().as_uri()
OUT = Path("/workspace/game-desk")
DEFAULT_SHOT = OUT / "check-screenshot.png"
WAIT_SECONDS = 3
LEVELS = range(1, 11)


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
    loads = [("http-default", BASE, DEFAULT_SHOT), ("file", FILE_URL, None)]
    for n in LEVELS:
        loads.append((f"http-level{n}", f"{BASE}/?level={n}", OUT / f"check-L{n}.png"))

    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 720})
        for label, url, shot in loads:
            found, console_errors, page_errors = check_page(page, url)
            if shot:
                page.screenshot(path=str(shot), full_page=True)
            results.append((label, url, found, console_errors, page_errors, shot))
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
        for item in console_errors:
            print(" console:", item)
        for item in page_errors:
            print(" page:", item)

    print("=== summary ===")
    print("loads:", len(results))
    print("all_canvas_found:", "yes" if all_canvas else "no")
    print("total_errors:", total)
    return 0 if total == 0 and all_canvas else 1


if __name__ == "__main__":
    sys.exit(main())
