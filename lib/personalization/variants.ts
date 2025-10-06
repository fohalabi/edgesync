import { ContentVariant, UserSegment } from '@/lib/types';
import { personalizationConfig } from '@/config/personalization';

export function selectVariant(segment: UserSegment): ContentVariant {
  const variant = personalizationConfig.variants.find(
    (v) => v.segment === segment.id
  );

  if (!variant) {
    return (
      personalizationConfig.variants.find((v) => v.segment === 'default') ||
      personalizationConfig.variants[0]
    );
  }

  return variant;
}

export function getVariantById(variantId: string): ContentVariant | undefined {
  return personalizationConfig.variants.find((v) => v.id === variantId);
}