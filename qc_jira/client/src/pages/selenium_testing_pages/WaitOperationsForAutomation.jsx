"use client";

import React, { memo } from "react";
import {
  FaClock,
  FaHourglassHalf,
  FaBolt,
  FaSyncAlt,
  FaLink,
  FaCheckCircle,
  FaCode,
} from "react-icons/fa";
import waitBanner from "../../assets/images/qa_banner.jpg";

const HERO_TAGS = [
  "WAITS",
  "SELENIUM",
  "PLAYWRIGHT",
  "JAVA",
  "PYTHON",
  "AUTOMATION",
];

const HERO_STYLE = {
  backgroundImage: `url(${waitBanner})`,
};

const WAIT_TYPES = [
  {
    title: "Thread.sleep()",
    icon: <FaClock className="mt-1 text-amber-500" />,
    summary:
      "A hard wait that pauses execution for a fixed amount of time, whether the element is ready or not.",
    useCases: [
      "Only for quick debugging or temporary observation",
      "Not recommended for real automation frameworks",
      "Can slow down tests unnecessarily",
    ],
    javaCode: `Thread.sleep(3000);`,
    pythonCode: `import time
time.sleep(3)`,
    playwrightCode: `await page.waitForTimeout(3000);`,
  },
  {
    title: "Implicit Wait",
    icon: <FaHourglassHalf className="mt-1 text-indigo-500" />,
    summary:
      "A global wait applied to element lookup. Selenium keeps polling for a given duration before throwing NoSuchElementException.",
    useCases: [
      "Basic synchronization across the framework",
      "Useful as a small default buffer",
      "Do not mix blindly with long explicit waits",
    ],
    javaCode: `driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));`,
    pythonCode: `driver.implicitly_wait(10)`,
    playwrightCode: `// Playwright does not use implicit waits like Selenium.
// It has built-in auto-waiting for actions and assertions.`,
  },
  {
    title: "Explicit Wait (WebDriverWait)",
    icon: <FaBolt className="mt-1 text-emerald-500" />,
    summary:
      "Waits for a specific condition, such as visibility, clickability, presence, title change, URL change, alert, frame, and more.",
    useCases: [
      "Best choice for most dynamic UI handling",
      "Wait until element is clickable or visible",
      "Wait for alerts, frames, text, title, or URL changes",
    ],
    javaCode: `WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement loginBtn = wait.until(
    ExpectedConditions.elementToBeClickable(By.id("login"))
);
loginBtn.click();`,
    pythonCode: `from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

wait = WebDriverWait(driver, 10)
login_btn = wait.until(EC.element_to_be_clickable((By.ID, "login")))
login_btn.click()`,
    playwrightCode: `await page.locator("#login").click();
// Playwright automatically waits for element readiness

await page.waitForSelector("#dashboard");
await expect(page).toHaveURL(/dashboard/);`,
  },
  {
    title: "FluentWait",
    icon: <FaSyncAlt className="mt-1 text-rose-500" />,
    summary:
      "A customizable wait where you define timeout, polling frequency, and ignored exceptions. Very useful for unstable or lazily rendered elements.",
    useCases: [
      "Retrying dynamic elements with custom polling",
      "Ignoring stale element or not found exceptions",
      "Useful for delayed content, re-rendered DOM, and polling-heavy screens",
    ],
    javaCode: `Wait<WebDriver> wait = new FluentWait<>(driver)
    .withTimeout(Duration.ofSeconds(20))
    .pollingEvery(Duration.ofMillis(500))
    .ignoring(NoSuchElementException.class)
    .ignoring(StaleElementReferenceException.class);

WebElement saveBtn = wait.until(d -> d.findElement(By.id("save")));
saveBtn.click();`,
    pythonCode: `from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException

wait = WebDriverWait(
    driver,
    20,
    poll_frequency=0.5,
    ignored_exceptions=[NoSuchElementException, StaleElementReferenceException]
)

save_btn = wait.until(lambda d: d.find_element(By.ID, "save"))
save_btn.click()`,
    playwrightCode: `// Playwright usually does not need a FluentWait equivalent.
// Retry behavior is handled through locators, assertions, and built-in waiting.

await expect(page.locator("#save")).toBeVisible();
await page.locator("#save").click();`,
  },
];

const EXPLICIT_WAIT_CASES = [
  "elementToBeClickable",
  "visibilityOfElementLocated",
  "presenceOfElementLocated",
  "invisibilityOfElementLocated",
  "alertIsPresent",
  "frameToBeAvailableAndSwitchToIt",
  "textToBePresentInElement",
  "titleContains / titleIs",
  "urlContains / urlToBe",
  "numberOfElementsToBeMoreThan",
];

const FLUENT_WAIT_CASES = [
  "Delayed buttons loaded after API response",
  "Elements that become stale after re-render",
  "Retrying custom conditions with polling",
  "Waiting for lazy-loaded sections before validation",
  "Waiting for link elements to appear before broken-link checks",
];

const BROKEN_LINK_NOTE = `
FluentWait is not used to 'detect' broken links by itself.
Instead, it can help you wait until links are loaded and stable before validating their href values using HTTP calls.
`;

function CodeBlock({ title, code }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
      <div className="border-b border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 bg-white">
        {title}
      </div>
      <pre className="overflow-x-auto p-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function WaitOperationsForAutomation() {
  return (
    <div className="service-page-wrap min-h-screen">
      {/* HERO */}
      <section className="service-hero-section" style={HERO_STYLE}>
        <div className="service-hero-overlay-1" />
        <div className="service-hero-overlay-2" />
        <div className="service-hero-overlay-3" />

        <div className="service-hero-container">
          <div className="service-hero-layout">
            <div>
              <div className="service-tag-row">
                {HERO_TAGS.map((item) => (
                  <span key={item} className="service-tag-pill">
                    {item}
                  </span>
                ))}
              </div>

              <h1 className="service-hero-title">
                Wait{" "}
                <span className="service-hero-title-highlight">
                  operations in automation
                </span>
              </h1>

              <p className="service-hero-text">
                Learn how hard waits, implicit waits, explicit waits, and
                FluentWait are used in Selenium and how similar waiting is
                handled in Playwright.
              </p>

              <div className="service-hero-status">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Synchronization · Stability · Reliable automation
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                <span>Java · Python · Playwright</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-200" />
                <span>Practical wait patterns</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="service-main-wrap">
        <div className="service-main-container">
          {/* OVERVIEW */}
          <section className="service-grid-two">
            <div className="service-parent-card">
              <p className="service-badge-heading">Wait strategy</p>
              <h2 className="service-main-heading">Why waits matter</h2>
              <p className="service-paragraph">
                UI automation often fails not because the locator is wrong, but
                because the element is not yet ready. Waits help automation code
                stay synchronized with the browser, the DOM, and API-driven UI
                changes.
              </p>

              <div className="space-y-3 mt-2">
                {[
                  "Use explicit waits for most real-world automation conditions.",
                  "Keep implicit waits small and controlled.",
                  "Avoid Thread.sleep() in production frameworks whenever possible.",
                  "Use FluentWait when you need custom polling and ignored exceptions.",
                ].map((item) => (
                  <div key={item} className="service-small-card">
                    <FaCheckCircle className="mt-1 text-emerald-500" />
                    <p className="service-list-paragraph">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card px-5 sm:px-6 py-5 sm:py-6">
              <p className="service-badge-heading">Best practice</p>
              <h3 className="mt-2 text-base sm:text-lg font-semibold text-slate-900">
                Prefer condition-based waits over fixed delays
              </h3>
              <p className="mt-3 service-paragraph">
                The best frameworks wait only as long as needed. That makes
                tests faster, more stable, and easier to maintain.
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Good practice
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Wait until a button becomes clickable, an alert is present,
                    or a loader disappears.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Poor practice
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Adding long Thread.sleep calls everywhere and hoping the UI
                    is ready.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* WAIT TYPES */}
          <section>
            <h2 className="service-main-heading">Core wait types</h2>
            <div className="mt-5 space-y-6">
              {WAIT_TYPES.map((item) => (
                <div key={item.title} className="service-parent-card">
                  <div className="flex items-start gap-3">
                    {item.icon}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 service-paragraph">{item.summary}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr),minmax(0,1.2fr)] gap-5 mt-2">
                    <div>
                      <p className="service-badge-heading">Where to use it</p>
                      <div className="mt-3 space-y-3">
                        {item.useCases.map((point) => (
                          <div key={point} className="service-small-card">
                            <FaCheckCircle className="mt-1 text-indigo-500" />
                            <p className="service-list-paragraph">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <CodeBlock title="Java" code={item.javaCode} />
                      <CodeBlock title="Python" code={item.pythonCode} />
                      <CodeBlock
                        title="Playwright"
                        code={item.playwrightCode}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* EXPLICIT WAIT CASES */}
          <section className="service-grid-two">
            <div className="service-parent-card">
              <p className="service-badge-heading">Explicit waits</p>
              <h2 className="service-main-heading">
                Common ExpectedConditions patterns
              </h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EXPLICIT_WAIT_CASES.map((item) => (
                  <div key={item} className="service-small-card">
                    <FaBolt className="mt-1 text-emerald-500" />
                    <p className="service-list-paragraph">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="service-parent-card">
              <p className="service-badge-heading">FluentWait</p>
              <h2 className="service-main-heading">
                Where FluentWait is useful
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3">
                {FLUENT_WAIT_CASES.map((item) => (
                  <div key={item} className="service-small-card">
                    <FaSyncAlt className="mt-1 text-rose-500" />
                    <p className="service-list-paragraph">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* BROKEN LINK NOTE */}
          <section className="service-parent-card">
            <div className="flex items-start gap-3">
              <FaLink className="mt-1 text-sky-500" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  FluentWait and broken-link validation
                </h2>
                <p className="mt-2 service-paragraph">{BROKEN_LINK_NOTE}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
              <CodeBlock
                title="Java idea"
                code={`List<WebElement> links = driver.findElements(By.tagName("a"));

for (WebElement link : links) {
    String href = link.getAttribute("href");
    if (href != null && !href.isBlank()) {
        // validate via HttpURLConnection or HttpClient
    }
}

// FluentWait can be used before this step
// to wait until links are visible and stable.`}
              />
              <CodeBlock
                title="Python idea"
                code={`links = driver.find_elements(By.TAG_NAME, "a")

for link in links:
    href = link.get_attribute("href")
    if href:
        # validate using requests.head() or requests.get()
        pass

# Use wait before collecting the links
# when the page renders links dynamically.`}
              />
            </div>
          </section>

          {/* QUICK REMEMBER */}
          <section className="service-parent-card">
            <div className="flex items-start gap-3">
              <FaCode className="mt-1 text-slate-900" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  Quick remember
                </h2>
                <p className="mt-2 service-paragraph">
                  In Selenium, explicit waits are usually the most useful. In
                  Playwright, many waits are already built into locator actions
                  and assertions, so code can stay cleaner and more reliable.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default memo(WaitOperationsForAutomation);
