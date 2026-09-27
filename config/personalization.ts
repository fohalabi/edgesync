import { PersonalizationConfig } from '@/lib/types';

export const personalizationConfig: PersonalizationConfig = {
  // Define user segments
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
        ['US', 'GB', 'CA', 'AU', 'NG'].includes(req.country || ''),
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
      matcher: () => true, // Fallback - always matches
    },
  ],

  // Define content variants for each segment - DASHBOARD THEME
  variants: [
    {
      id: 'mobile-us-variant',
      segment: 'mobile-us',
      content: {
        headline: 'Lightning-Fast Edge Performance',
        subheadline: 'Deliver personalized content in under 50ms across the US',
        cta: 'View Dashboard',
        theme: 'default',
      },
      experimentContent: {
        'variant-a': { cta: 'See it in action' },
        'variant-b': { headline: 'Your fastest experience starts at the edge' },
      },
    },
    {
      id: 'mobile-international-variant',
      segment: 'mobile-international',
      content: {
        headline: 'Global Edge Network at Your Fingertips',
        subheadline: 'Real-time personalization from 24+ edge locations worldwide',
        cta: 'Explore Analytics',
        theme: 'casual',
      },
      experimentContent: {
        'variant-a': { cta: 'Explore the live demo' },
        'variant-b': { headline: 'One web experience, intelligently adapted worldwide' },
      },
    },
    {
      id: 'desktop-premium-variant',
      segment: 'desktop-premium',
      content: {
        headline: 'Enterprise-Grade Personalization Layer',
        subheadline: 'Intelligent content delivery powered by edge computing',
        cta: 'See Performance Metrics',
        theme: 'premium',
      },
      experimentContent: {
        'variant-a': { cta: 'Inspect the edge layer' },
        'variant-b': { headline: 'Personalization infrastructure built for the edge' },
      },
    },
    {
      id: 'desktop-default-variant',
      segment: 'desktop-default',
      content: {
        headline: 'Smart Personalization at the Edge',
        subheadline: 'Deliver the right content to the right user instantly',
        cta: 'View Dashboard',
        theme: 'default',
      },
      experimentContent: {
        'variant-a': { cta: 'Open the experience' },
        'variant-b': { headline: 'Make every request feel intentionally personal' },
      },
    },
    {
      id: 'default-variant',
      segment: 'default',
      content: {
        headline: 'Edge-Powered Personalization Layer',
        subheadline: 'Real-time intelligent content delivery with sub-50ms latency',
        cta: 'Get Started',
        theme: 'default',
      },
      experimentContent: {
        'variant-a': { cta: 'Explore EdgeSync' },
        'variant-b': { headline: 'The personalization layer that moves at edge speed' },
      },
    },
  ],

  // Define A/B experiments
  experiments: [
    {
      id: 'hero-cta-test',
      name: 'Hero CTA Button Test',
      enabled: true,
      variants: ['control', 'variant-a', 'variant-b'],
      traffic: 1.0, // 100% of users
    },
  ],
};
