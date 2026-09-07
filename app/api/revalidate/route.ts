import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

// Map Sanity document _type → Next.js cache tag
const TYPE_TO_TAG: Record<string, string> = {
  siteSettings: "settings",
  post: "posts",
  bookReview: "reviews",
  brandCollab: "collabs",
  writingPiece: "writing",
  about: "about",
  shelfPick: "shelf",
};

// Map Sanity document _type → Next.js page path to ensure page route cache is purged
const TYPE_TO_PATH: Record<string, string> = {
  siteSettings: "/",
  post: "/",
  bookReview: "/reviews",
  brandCollab: "/",
  writingPiece: "/writing",
  about: "/",
  shelfPick: "/shelf",
};

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    console.error("[revalidate] SANITY_REVALIDATE_SECRET is not set.");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  // Read raw body for signature verification
  const body = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER_NAME) ?? "";

  // Verify Sanity webhook signature
  const valid = await isValidSignature(body, signature, secret);
  if (!valid) {
    console.warn("[revalidate] Invalid webhook signature.");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Parse the _type from the webhook payload
  let docType: string;
  try {
    const payload = JSON.parse(body) as { _type?: string };
    docType = payload._type ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const tag = TYPE_TO_TAG[docType];
  const path = TYPE_TO_PATH[docType];

  if (tag) {
    revalidateTag(tag, { expire: 0 });
    if (path) {
      revalidatePath(path);
    }
    console.log(
      `[revalidate] Revalidated tag: "${tag}" and path: "${path}" for type: "${docType}"`
    );
    return NextResponse.json(
      { revalidated: true, tag, path },
      { status: 200 }
    );
  }

  // Unknown type — still 200, just no action
  console.log(`[revalidate] No tag mapping for type: "${docType}". Ignoring.`);
  return NextResponse.json({ revalidated: false, docType }, { status: 200 });
}
