import { PersonalizationConfig } from "@/lib/types";

export const personalizationConfig: PersonalizationConfig = {
  segments: [
    {
      id: 'mobile-us',
      name: 'US Mobile Users',
      priority: 10,
      matcher: (req) => req.country === 'US' && req.device === 'mobile',
    },
    {
      id: 'mobile-international',
      name: 'International Mobile Users',
      priority: 9,
      matcher: (req) => req.country !== 'US' && req.device === 'mobile',
    },
    {
      id: 'desktop-premium',
      name: 'Desktop Premium Markets',
      priority: 8,
      matcher: (req) =>
        req.device === 'desktop' &&
        ['US', 'GB', 'CA', 'AU'].includes(req.country || ''),
    },
    {
      id: 'desktop-default',
      name: 'Desktop Default',
      priority: 5,
      matcher: (req) => req.device === 'desktop',
    },
    {
      id: 'default',
      name: 'Default Segment',
      priority: 1,
      matcher: () => true,
    },
  ],

  variants: [
    {
      id: 'mobile-us-variant',
      segment: 'mobile-us',
      content: {
        headline: '🇺🇸 Fast Delivery Across America',
        subheadline: 'Free shipping on orders over $50',
        cta: 'Shop Now',
        theme: 'default',
      },
    },
    {
      id: 'mobile-international-variant',
      segment: 'mobile-international',
      content: {
        headline: '🌍 Global Shipping Available',
        subheadline: 'Delivering to your country',
        cta: 'Explore',
        theme: 'casual',
      },
    },
    {
      id: 'desktop-premium-variant',
      segment: 'desktop-premium',
      content: {
        headline: 'Premium Quality, Exceptional Service',
        subheadline: 'Experience the difference with our curated collection',
        cta: 'Discover More',
        theme: 'premium',
      },
    },
    {
      id: 'desktop-default-variant',
      segment: 'desktop-default',
      content: {
        headline: 'Welcome to Our Store',
        subheadline: 'Find everything you need in one place',
        cta: 'Start Shopping',
        theme: 'default',
      },
    },
    {
      id: 'default-variant',
      segment: 'default',
      content: {
        headline: 'Welcome',
        subheadline: 'Discover amazing products',
        cta: 'Get Started',
        theme: 'default',
      },
    },
  ],

  experiments: [
    {
      id: 'hero-cta-test',
      name: 'Hero CTA Button Test',
      enabled: true,
      variants: ['control', 'variant-a', 'variant-b'],
      traffic: 1.0,
    },
  ],
};
