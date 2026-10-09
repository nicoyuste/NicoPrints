import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
const outputPath = resolve('public/data/instagram.json')
const apiUrl = new URL('https://graph.instagram.com/v23.0/me/media')

apiUrl.searchParams.set('fields', [
  'id',
  'caption',
  'media_type',
  'media_url',
  'thumbnail_url',
  'permalink',
  'timestamp',
  'children{media_type,media_url,thumbnail_url}',
].join(','))
apiUrl.searchParams.set('limit', '12')

if (!accessToken) {
  console.error('INSTAGRAM_ACCESS_TOKEN is not configured.')
  process.exit(1)
}

function isHttpsUrl(value) {
  if (typeof value !== 'string') return false

  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function imageFor(post) {
  const directImage = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url
  if (isHttpsUrl(directImage)) return directImage

  const firstChild = post.children?.data?.find((child) => (
    isHttpsUrl(child.media_url) || isHttpsUrl(child.thumbnail_url)
  ))

  if (!firstChild) return null
  return firstChild.media_type === 'VIDEO'
    ? firstChild.thumbnail_url
    : firstChild.media_url
}

function sanitize(post) {
  const image = imageFor(post)
  if (!post.id || !image || !isHttpsUrl(post.permalink)) return null

  return {
    id: String(post.id),
    image,
    permalink: post.permalink,
    caption: typeof post.caption === 'string' ? post.caption.slice(0, 500) : '',
    timestamp: typeof post.timestamp === 'string' ? post.timestamp : '',
    mediaType: typeof post.media_type === 'string' ? post.media_type : '',
  }
}

async function syncInstagram() {
  let response

  try {
    response = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(20_000),
    })
  } catch {
    throw new Error('Instagram could not be reached; the existing cache was preserved.')
  }

  if (!response.ok) {
    // Only log numeric diagnostics; Meta's raw response can contain sensitive data.
    const payload = await response.json().catch(() => null)
    const code = payload?.error?.code
    const subcode = payload?.error?.error_subcode
    const diagnostics = [
      Number.isInteger(code) ? `Meta code ${code}` : null,
      Number.isInteger(subcode) ? `subcode ${subcode}` : null,
    ].filter(Boolean)
    const detail = diagnostics.length ? ` (${diagnostics.join(', ')})` : ''
    const guidance = response.status === 401 || code === 190
      ? ' The access token was rejected. Generate a new token for capia3d in Meta, replace the INSTAGRAM_ACCESS_TOKEN GitHub Actions repository secret, and manually run Sync Instagram feed.'
      : response.status === 403 || code === 10 || code === 200
        ? ' Check the Meta app permissions and the capia3d account authorization.'
        : response.status === 429 || response.status >= 500
          ? ' Meta may be temporarily unavailable or rate limiting requests; retry later.'
          : ''

    throw new Error(`Instagram returned HTTP ${response.status}${detail}; the existing cache was preserved.${guidance}`)
  }

  const payload = await response.json()
  if (!Array.isArray(payload.data)) {
    throw new Error('Instagram returned an unexpected response; the existing cache was preserved.')
  }

  const posts = payload.data.map(sanitize).filter(Boolean)
  if (payload.data.length > 0 && posts.length === 0) {
    throw new Error('Instagram returned no usable images; the existing cache was preserved.')
  }

  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(posts, null, 2)}\n`, 'utf8')
  console.log(`Instagram cache updated with ${posts.length} posts.`)
}

syncInstagram().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
