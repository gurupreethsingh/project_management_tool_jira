"use client";

import React, { memo } from "react";
import {
  FaLink,
  FaCheckCircle,
  FaTimesCircle,
  FaBug,
  FaGlobe,
  FaCode,
  FaSearch,
  FaNetworkWired,
  FaExternalLinkAlt,
} from "react-icons/fa";
import brokenLinksBanner from "../../assets/images/qa_banner.jpg";

const HERO_TAGS = [
  "BROKEN LINKS",
  "SELENIUM",
  "JAVA",
  "PYTHON",
  "API VALIDATION",
  "AUTOMATION",
];

const HERO_STYLE = {
  backgroundImage: `url(${brokenLinksBanner})`,
};

const LINK_CHECK_APPROACHES = [
  {
    title: "UI Collection + HTTP Validation",
    icon: <FaLink className="mt-1 text-indigo-500" />,
    description:
      "Collect all anchor tags from the UI using Selenium or Playwright, extract href values, and validate each link using an HTTP request.",
  },
  {
    title: "Status Code Verification",
    icon: <FaCheckCircle className="mt-1 text-emerald-500" />,
    description:
      "Mark links as valid or broken based on HTTP response codes such as 200, 301, 302, 403, 404, or 500.",
  },
  {
    title: "Filtered Validation",
    icon: <FaSearch className="mt-1 text-amber-500" />,
    description:
      "Ignore empty hrefs, javascript:void(0), mailto:, tel:, and anchor-only links depending on your test purpose.",
  },
  {
    title: "Dynamic Page Stability",
    icon: <FaNetworkWired className="mt-1 text-rose-500" />,
    description:
      "Wait until the page and anchor elements are stable before collecting href values to avoid stale elements and incomplete link lists.",
  },
];

const COMMON_STATUS_CODES = [
  { code: "200", meaning: "OK / valid link", color: "text-emerald-500" },
  { code: "301 / 302", meaning: "Redirected link", color: "text-sky-500" },
  { code: "403", meaning: "Forbidden", color: "text-amber-500" },
  { code: "404", meaning: "Broken / not found", color: "text-rose-500" },
  { code: "500", meaning: "Server error", color: "text-red-500" },
];

const BEST_PRACTICES = [
  "Ignore href values that are null, blank, '#', or javascript-based when your goal is HTTP validation.",
  "Validate only absolute http/https links unless your framework also handles relative URL resolution.",
  "Use waits before collecting links on pages where content loads dynamically.",
  "Capture the page name, link text, href, and response code in your report.",
  "Do not fail the entire run immediately if one link is broken—collect all broken links for better reporting.",
];

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

function BrokenLinksOperations() {
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
                Broken links{" "}
                <span className="service-hero-title-highlight">operations</span>
              </h1>

              <p className="service-hero-text">
                Learn how to collect links from a page, validate their HTTP
                responses, and report broken or invalid URLs using Java, Python,
                Selenium, and automation-friendly patterns.
              </p>

              <div className="service-hero-status">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Link validation · Reporting · Automation reliability
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                <span>UI + HTTP validation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-200" />
                <span>Java · Python · Playwright idea</span>
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
              <p className="service-badge-heading">Concept</p>
              <h2 className="service-main-heading">
                What is broken-link testing?
              </h2>
              <p className="service-paragraph">
                Broken-link testing checks whether links on a page lead to valid
                destinations. In automation, the common approach is to collect
                anchor elements from the UI and then validate their href values
                through HTTP requests.
              </p>

              <div className="mt-4 space-y-3">
                <div className="service-small-card">
                  <FaCheckCircle className="mt-1 text-emerald-500" />
                  <p className="service-list-paragraph">
                    Valid links usually return a healthy response like 200.
                  </p>
                </div>
                <div className="service-small-card">
                  <FaTimesCircle className="mt-1 text-rose-500" />
                  <p className="service-list-paragraph">
                    Broken links often return 404, 500, or other failing
                    responses.
                  </p>
                </div>
                <div className="service-small-card">
                  <FaBug className="mt-1 text-amber-500" />
                  <p className="service-list-paragraph">
                    Dynamic pages may require a wait before collecting all
                    links.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card px-5 sm:px-6 py-5 sm:py-6">
              <p className="service-badge-heading">Core idea</p>
              <h3 className="mt-2 text-base sm:text-lg font-semibold text-slate-900">
                Selenium finds the links. HTTP validates them.
              </h3>
              <p className="mt-3 service-paragraph">
                Selenium itself does not confirm whether a link is alive. It
                helps you locate the links in the browser. The actual validation
                is usually done with an HTTP client such as HttpURLConnection,
                HttpClient, requests, or fetch-like libraries.
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    UI responsibility
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Find all anchor tags and extract href, link text, or other
                    useful metadata.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    API responsibility
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Send HTTP requests and read the returned status code.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* APPROACHES */}
          <section>
            <h2 className="service-main-heading">Common approaches</h2>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {LINK_CHECK_APPROACHES.map((item) => (
                <div key={item.title} className="service-parent-card">
                  <div className="flex items-start gap-3">
                    {item.icon}
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 service-small-paragraph">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* STATUS CODES */}
          <section className="service-parent-card">
            <p className="service-badge-heading">Response handling</p>
            <h2 className="service-main-heading">Common HTTP status codes</h2>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {COMMON_STATUS_CODES.map((item) => (
                <div
                  key={item.code}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className={`text-lg font-bold ${item.color}`}>
                    {item.code}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    {item.meaning}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* JAVA CODE */}
          <section className="service-parent-card">
            <div className="flex items-start gap-3">
              <FaCode className="mt-1 text-indigo-500" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  Java + Selenium broken-links example
                </h2>
                <p className="mt-2 service-paragraph">
                  This example finds all anchor elements, filters usable href
                  values, and validates them using HttpURLConnection.
                </p>
              </div>
            </div>

            <CodeBlock
              title="Java"
              code={`import java.net.HttpURLConnection;
import java.net.URL;
import java.time.Duration;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class BrokenLinksCheck {
    public static void main(String[] args) {
        WebDriver driver = new ChromeDriver();

        try {
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
            driver.get("https://example.com");

            List<WebElement> links = driver.findElements(By.tagName("a"));

            for (WebElement link : links) {
                String linkText = link.getText().trim();
                String href = link.getAttribute("href");

                if (href == null || href.isBlank()) {
                    System.out.println("Skipped blank href -> " + linkText);
                    continue;
                }

                if (!href.startsWith("http")) {
                    System.out.println("Skipped non-http link -> " + href);
                    continue;
                }

                try {
                    URL url = new URL(href);
                    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                    connection.setRequestMethod("HEAD");
                    connection.setConnectTimeout(5000);
                    connection.setReadTimeout(5000);
                    connection.connect();

                    int statusCode = connection.getResponseCode();

                    if (statusCode >= 400) {
                        System.out.println("BROKEN: " + href + " -> " + statusCode);
                    } else {
                        System.out.println("VALID : " + href + " -> " + statusCode);
                    }

                    connection.disconnect();
                } catch (Exception e) {
                    System.out.println("ERROR : " + href + " -> " + e.getMessage());
                }
            }
        } finally {
            driver.quit();
        }
    }
}`}
            />
          </section>

          {/* PYTHON CODE */}
          <section className="service-parent-card">
            <div className="flex items-start gap-3">
              <FaGlobe className="mt-1 text-emerald-500" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  Python + Selenium broken-links example
                </h2>
                <p className="mt-2 service-paragraph">
                  Python frameworks often use the requests library to validate
                  URLs after collecting them from the browser.
                </p>
              </div>
            </div>

            <CodeBlock
              title="Python"
              code={`import requests
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()

try:
    driver.get("https://example.com")
    links = driver.find_elements(By.TAG_NAME, "a")

    for link in links:
        link_text = link.text.strip()
        href = link.get_attribute("href")

        if not href:
            print(f"Skipped blank href -> {link_text}")
            continue

        if not href.startswith("http"):
            print(f"Skipped non-http link -> {href}")
            continue

        try:
            response = requests.head(href, timeout=5, allow_redirects=True)
            status_code = response.status_code

            if status_code >= 400:
                print(f"BROKEN: {href} -> {status_code}")
            else:
                print(f"VALID : {href} -> {status_code}")

        except Exception as e:
            print(f"ERROR : {href} -> {str(e)}")

finally:
    driver.quit()`}
            />
          </section>

          {/* PLAYWRIGHT IDEA */}
          <section className="service-grid-two">
            <div className="service-parent-card">
              <p className="service-badge-heading">Playwright idea</p>
              <h2 className="service-main-heading">
                Playwright can also collect and validate links
              </h2>
              <p className="service-paragraph">
                In Playwright, you can collect href values from locators and
                validate them using API requests. Playwright is especially
                useful when combined with built-in waiting and locator
                stability.
              </p>

              <CodeBlock
                title="Playwright idea"
                code={`const links = await page.locator("a").evaluateAll(elements =>
  elements.map(a => ({
    text: a.textContent?.trim() || "",
    href: a.getAttribute("href")
  }))
);

for (const link of links) {
  if (!link.href || !link.href.startsWith("http")) continue;

  const response = await page.request.get(link.href);
  const status = response.status();

  if (status >= 400) {
    console.log("BROKEN:", link.href, status);
  } else {
    console.log("VALID :", link.href, status);
  }
}`}
              />
            </div>

            <div className="service-parent-card">
              <p className="service-badge-heading">Best practices</p>
              <h2 className="service-main-heading">
                Reliable broken-link automation tips
              </h2>

              <div className="mt-4 space-y-3">
                {BEST_PRACTICES.map((item) => (
                  <div key={item} className="service-small-card">
                    <FaCheckCircle className="mt-1 text-indigo-500" />
                    <p className="service-list-paragraph">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* REPORTING */}
          <section className="service-parent-card">
            <div className="flex items-start gap-3">
              <FaExternalLinkAlt className="mt-1 text-sky-500" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  What should students report?
                </h2>
                <p className="mt-2 service-paragraph">
                  A good broken-link report should contain the page URL, total
                  links found, total links validated, skipped links, broken
                  links, valid links, response codes, and the exact href values.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                "Page under test",
                "Link text and href",
                "Response code",
                "Broken vs valid summary",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm font-semibold text-slate-900">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default memo(BrokenLinksOperations);
