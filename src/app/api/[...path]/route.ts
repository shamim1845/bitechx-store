import { NextRequest, NextResponse } from "next/server";

const TARGET = "https://api.bitechx.com";

export async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const pathParams = await params;
  const path = "/" + (pathParams.path?.join("/") || "");
  const url = `${TARGET}${path}${req.nextUrl.search}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000 * 4);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const auth = req.headers.get("authorization");
    if (auth) headers["Authorization"] = auth;

    const init: RequestInit = {
      method: req.method,
      headers,
      signal: controller.signal,
      cache: "no-store",
    } as RequestInit;

    if (req.method !== "GET" && req.method !== "HEAD") {
      const body = await req.text();
      init.body = body;
    }

    const res = await fetch(url, init);
    const text = await res.text();
    clearTimeout(timeout);
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch (e: any) {
    clearTimeout(timeout);
    const status = e?.name === "AbortError" ? 504 : 502;
    return NextResponse.json(
      { message: "Upstream error", error: String(e?.message || e) },
      { status }
    );
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
