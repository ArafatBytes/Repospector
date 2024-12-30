import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";
import { headers } from "next/headers";
import { cookies } from "next/headers";

export async function GET(request, { params }) {
  try {
    // Get the headers and params
    const headersList = await headers();
    const cookieStore = cookies();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const { id } = await params;

    // Get authentication cookie
    const authCookie = cookieStore.get("token");
    if (!authCookie) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Configure chromium
    await chromium.font(
      "https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Regular.ttf"
    );

    // Launch browser with specific configuration for Vercel
    const browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        "--autoplay-policy=user-gesture-required",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-update",
        "--disable-default-apps",
        "--disable-dev-shm-usage",
        "--disable-domain-reliability",
        "--disable-extensions",
        "--disable-features=AudioServiceOutOfProcess",
        "--disable-hang-monitor",
        "--disable-ipc-flooding-protection",
        "--disable-notifications",
        "--disable-offer-store-unmasked-wallet-cards",
        "--disable-popup-blocking",
        "--disable-print-preview",
        "--disable-prompt-on-repost",
        "--disable-renderer-backgrounding",
        "--disable-setuid-sandbox",
        "--disable-speech-api",
        "--disable-sync",
        "--hide-scrollbars",
        "--ignore-gpu-blacklist",
        "--metrics-recording-only",
        "--mute-audio",
        "--no-default-browser-check",
        "--no-first-run",
        "--no-pings",
        "--no-sandbox",
        "--no-zygote",
        "--password-store=basic",
        "--use-gl=swiftshader",
        "--use-mock-keychain",
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    // Set the authentication cookie
    await page.setCookie({
      name: "token",
      value: authCookie.value,
      domain: host,
      path: "/",
    });

    // Set viewport to ensure consistent rendering
    await page.setViewport({
      width: 1280,
      height: 1024,
      deviceScaleFactor: 1,
    });

    // Navigate to the inspection view page
    const url = `${protocol}://${host}/inspection/${id}`;

    console.log("Navigating to URL:", url);

    await page.goto(url, {
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 60000, // Increased timeout to 60 seconds
    });

    console.log("Page loaded, waiting for content");

    // Wait for the content to be loaded
    await page.waitForSelector(".max-w-4xl", {
      timeout: 60000,
      visible: true,
    });

    console.log("Content loaded, generating PDF");

    // Generate PDF with specific settings
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
      preferCSSPageSize: true,
      timeout: 60000,
    });

    console.log("PDF generated successfully");

    // Close browser
    await browser.close();

    // Return PDF
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="inspection-${id}.pdf"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return new Response(
      JSON.stringify({
        error: "Failed to generate PDF",
        details: error.message,
        stack: error.stack,
        name: error.name,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
  }
}
