import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from '../env'

// Initialize the image builder
const builder = createImageUrlBuilder({ projectId, dataset });

// Ensure `.url()` is called
export const urlFor = (source: SanityImageSource) => {
  return builder.image(source).width(800).format("webp").url(); 
}

