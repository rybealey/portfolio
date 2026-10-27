// POST /api/v1/media uploads one image as the raw request body, with its
// Content-Type. Attach it to a note by the returned sha256, or use its url in
// a Markdown body.
import { ApiError, json, route } from '../../../../lib/api';
import { IMAGE_TYPES, MAX_UPLOAD_BYTES, storeUpload } from '../../../../lib/publish';

const isImageType = (value: string): value is (typeof IMAGE_TYPES)[number] => (IMAGE_TYPES as readonly string[]).includes(value);

export const POST = route(async ({ request }) => {
  const type = (request.headers.get('content-type') ?? '').split(';')[0]!.trim();
  if (!isImageType(type)) throw new ApiError(415, 'unsupported_media_type', `Send the image bytes with one of: ${IMAGE_TYPES.join(', ')}`);
  if (Number(request.headers.get('content-length') ?? 0) > MAX_UPLOAD_BYTES) throw new ApiError(413, 'too_large', 'Images can be up to 15 MB');
  const bytes = Buffer.from(await request.arrayBuffer());
  if (!bytes.byteLength) throw new ApiError(400, 'empty', 'The body is empty');
  if (bytes.byteLength > MAX_UPLOAD_BYTES) throw new ApiError(413, 'too_large', 'Images can be up to 15 MB');
  return json({ image: await storeUpload(bytes, type) }, 201);
});
