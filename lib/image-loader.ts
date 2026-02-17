import type { ImageLoaderProps } from 'next/image'

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}${src}?w=${width}&q=${quality ?? 75}`
}