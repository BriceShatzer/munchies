import type { ImageLoaderProps } from 'next/image'
import { API_BASE_URL } from "@/config";

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  return `${API_BASE_URL}${src}?w=${width}&q=${quality ?? 75}`
}