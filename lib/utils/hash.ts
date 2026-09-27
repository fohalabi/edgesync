export function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

export function consistentHash(userId: string, experimentId: string, buckets: number): number {
    const combined = `${userId}-${experimentId}`;
    const hash = hashString(combined);
    return hash % buckets;
}

export function assignExperimentVariant(
    userId: string,
    experimentId: string,
    variants: string[],
    traffic: number = 1.0
) : string {
    const includeHash = consistentHash(userId, `${experimentId}-include`, 100);
    if (includeHash >= traffic * 100) {
        return 'control';
    }

    const variantIndex = consistentHash(userId, experimentId, variants.length);
    return variants[variantIndex];
}

export function assignWeightedVariant(userId: string, experimentId: string, variants: Array<{ key: string; weight: number }>, traffic: number): string | undefined {
    if (!variants.length || consistentHash(userId, `${experimentId}-include`, 100) >= traffic) return undefined;
    const total = variants.reduce((sum, variant) => sum + variant.weight, 0);
    const bucket = consistentHash(userId, experimentId, total);
    let cursor = 0;
    for (const variant of variants) { cursor += variant.weight; if (bucket < cursor) return variant.key; }
    return variants[variants.length - 1].key;
}
