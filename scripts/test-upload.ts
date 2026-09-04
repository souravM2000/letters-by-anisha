import { sanityWriteClient } from '../sanity/lib/writeClient';

async function testUpload() {
  const testImageUrl = "https://wishlink-proxy.gumlet.io/fetch/https%3A//gcp-cdn.wishlink.com/creator-media-images/thumbnail_anishaghosh40063_p8473489_f5977921-251d-4b4d-b372-8673a3a4c3e5.jpg";
  console.log("Fetching image from URL:", testImageUrl);
  const res = await fetch(testImageUrl);
  console.log("Image fetch status:", res.status, "content-type:", res.headers.get("content-type"));
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  console.log("Buffer length:", buffer.length);

  console.log("Uploading to Sanity Asset CDN...");
  const asset = await sanityWriteClient.assets.upload('image', buffer, {
    filename: 'test-upload.jpg',
    contentType: 'image/jpeg',
  });
  console.log("Uploaded successfully! Asset ID:", asset._id);
}

testUpload().catch(console.error);
