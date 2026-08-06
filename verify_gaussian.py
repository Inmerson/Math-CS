from playwright.sync_api import Page, expect, sync_playwright

def verify_gaussian_view(page: Page):
    # 1. Arrange: Go to the homepage.
    print("Navigating to home page...")
    page.goto("http://localhost:3000/Math-Biotech-Project/")

    # 2. Act: Select Matrix Module
    print("Clicking Matrix module...")
    # Using 'Matrix' text which is in the button
    matrix_card = page.get_by_text("Matrix", exact=True).first
    matrix_card.click()

    # 3. Act: Select Gaussian Elimination
    print("Clicking Gaussian Elimination...")
    gaussian_btn = page.get_by_role("button", name="Gaussian Elimination")
    gaussian_btn.click()

    # 4. Assert: Check if Gaussian View is loaded
    print("Verifying page content...")
    heading = page.get_by_role("heading", name="Gaussian Elimination")
    expect(heading).to_be_visible()

    # 5. Screenshot
    print("Taking screenshot...")
    page.screenshot(path="/home/jules/verification/gaussian_view.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_gaussian_view(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="/home/jules/verification/error.png")
            raise e
        finally:
            browser.close()
