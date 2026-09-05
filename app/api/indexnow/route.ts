const INDEXNOW_KEY = "aa0c25c738384b7f81b7799b7bad3b74";
const HOST = "www.sellbookmedia.com";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const urls: string[] = Array.isArray(body.urls)
      ? body.urls
      : body.url
        ? [body.url]
        : [];

    if (urls.length === 0) {
      return Response.json(
        { error: "No URLs provided" },
        { status: 400 }
      );
    }

    const validUrls = urls.filter((url) =>
      url.startsWith(`https://${HOST}/`)
    );

    if (validUrls.length === 0) {
      return Response.json(
        { error: "No valid SellBookMedia URLs provided" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: validUrls,
      }),
    });

    return Response.json({
      success: response.ok,
      status: response.status,
      submitted: validUrls,
    });
  } catch (error) {
    console.error("IndexNow error:", error);

    return Response.json(
      { error: "IndexNow submission failed" },
      { status: 500 }
    );
  }
}