export type UserSegment = {
    id: string;
    country: string;
    device: 'mobile' | 'desktop' | 'tablet';
    isNewUser: boolean;
    experimentVariant?: string;
};

export type ContentVariant = {
    id: string;
    segment: string;
    content: {
        headline: string;
        subheadline: string;
        cta: string;
        theme?: 'default' | 'premium' | 'casual';
    };
};

export type PersonalizationConfig = {
  segments: SegmentRule[];
  variants: ContentVariant[];
  experiments: ExperimentConfig[];
};

export type SegmentRule = {
  id: string;
  name: string;
  matcher: (request: PersonalizationRequest) => boolean;
  priority: number;
};

export type ExperimentConfig = {
  id: string;
  name: string;
  enabled: boolean;
  variants: string[];
  traffic: number;
};

export type PersonalizationRequest = {
  country?: string;
  device: string;
  cookies: Map<string, string>;
  headers: Map<string, string>;
  pathname: string;
};

export type PersonalizationResult = {
  segment: UserSegment;
  variant: ContentVariant;
  experimentVariant?: string;
};