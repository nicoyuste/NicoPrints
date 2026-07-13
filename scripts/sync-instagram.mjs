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
    throw new Error(`Instagram returned HTTP ${response.status}; the existing cache was preserved.`)
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
