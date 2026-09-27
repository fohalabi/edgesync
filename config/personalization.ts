import { PersonalizationConfig } from '@/lib/types';

export const personalizationConfig: PersonalizationConfig = {
  // Define user segments
  segments: [
    {
      id: 'slow-mobile',
      name: 'Slow-network mobile visitors',
      priority: 30,
      enabled: true,
      expression: { combinator: 'and', items: [
        { field: 'device', operator: 'equals', value: 'mobile' },
        { field: 'network', operator: 'equals', value: 'slow' },
      ] },
    },
    {
      id: 'french-language',
      name: 'French-speaking visitors',
      priority: 25,
      enabled: true,
      expression: { combinator: 'and', items: [{ field: 'language', operator: 'equals', value: 'fr' }] },
    },
    {
      id: 'campaign-visitor',
      name: 'Campaign visitors',
      priority: 20,
      enabled: true,
      expression: { combinator: 'and', items: [{ field: 'referrer', operator: 'equals', value: 'campaign' }] },
    },
    {
      id: 'evening-visitor',
      name: 'Evening visitors',
      priority: 15,
      enabled: true,
      expression: { combinator: 'or', items: [
        { field: 'localHour', operator: 'gte', value: 18 },
        { field: 'localHour', operator: 'lte', value: 5 },
      ] },
    },
    {
      id: 'mobile-us',
      name: 'US Mobile Users',
      priority: 10,
      enabled: true,
      expression: { combinator: 'and', items: [
        { field: 'country', operator: 'equals', value: 'US' },
        { field: 'device', operator: 'equals', value: 'mobile' },
      ] },
    },
    {
      id: 'mobile-international',
      name: 'International Mobile Users',
      priority: 9,
      enabled: true,
      expression: { combinator: 'and', items: [
        { field: 'country', operator: 'not_equals', value: 'US' },
        { field: 'device', operator: 'equals', value: 'mobile' },
      ] },
    },
    {
      id: 'desktop-premium',
      name: 'Desktop Premium Markets',
      priority: 8,
      enabled: true,
      expression: { combinator: 'and', items: [
        { field: 'device', operator: 'equals', value: 'desktop' },
        { field: 'country', operator: 'in', value: ['US', 'GB', 'CA', 'AU', 'NG'] },
      ] },
    },
    {
      id: 'desktop-default',
      name: 'Desktop Default',
      priority: 5,
      enabled: true,
      expression: { combinator: 'and', items: [{ field: 'device', operator: 'equals', value: 'desktop' }] },
    },
    {
      id: 'default',
      name: 'Default Segment',
      priority: 0,
      enabled: true,
      fallback: true,
      expression: { combinator: 'and', items: [] },
    },
  ],

  // Define content variants for each segment - DASHBOARD THEME
  variants: [
    {
      id: 'slow-mobile-variant',
      segment: 'slow-mobile',
      content: { headline: 'A lighter experience, delivered instantly', subheadline: 'EdgeSync adapts the experience for a slower connection without losing the essentials', cta: 'View lightweight mode', theme: 'casual' },
    },
    {
      id: 'french-language-variant',
      segment: 'french-language',
      content: { headline: 'Une expérience conçue pour votre contexte', subheadline: 'Le bon contenu, adapté à chaque visiteur dès la périphérie', cta: 'Voir le tableau de bord', theme: 'premium' },
    },
    {
      id: 'campaign-visitor-variant',
      segment: 'campaign-visitor',
      content: { headline: 'Your campaign journey continues here', subheadline: 'A focused experience shaped around the path that brought you here', cta: 'Continue exploring', theme: 'premium' },
    },
    {
      id: 'evening-visitor-variant',
      segment: 'evening-visitor',
      content: { headline: 'Personalization that never clocks out', subheadline: 'EdgeSync responds to local context around the clock', cta: 'Explore the night shift', theme: 'default' },
    },
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
