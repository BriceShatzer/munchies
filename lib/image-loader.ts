import type { ImageLoaderProps } from 'next/image'

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  return `https://work-test-web-2024-eze6j4scpq-lz.a.run.app${src}?w=${width}&q=${quality ?? 75}`
}