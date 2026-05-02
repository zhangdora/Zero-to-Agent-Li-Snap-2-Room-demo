import type { Asset, Room } from "./types";
import {
  getMockProductOptionsForAsset,
  sortProductOptionsForPriorities,
  type ProductOption,
} from "./mock-purchase-data";

type SearchFurnitureProductsParams = {
  asset: Asset;
  room?: Room | null;
  priorities?: string[];
};

type SearchFurnitureProductsResult = {
  source: "bright_data" | "mock";
  query: string;
  products: ProductOption[];
  error?: string;
};

type SearchResultItem = {
  title?: string;
  name?: string;
  product_title?: string;
  heading?: string;
  link?: string;
  url?: string;
  product_link?: string;
  href?: string;
  display_link?: string;
  displayLink?: string;
  displayed_link?: string;
  domain?: string;
  source?: string;
  snippet?: string;
  description?: string;
  text?: string;
  content?: string;
  price?: string | number | { value?: number | string; amount?: number | string };
  extracted_price?: string | number;
  price_value?: string | number;
};

const API_URL = "https://api.brightdata.com/request";

function getAssetColour(asset: Asset) {
  return (asset as Asset & { colour?: string }).colour ?? asset.color;
}

function fallback(
  asset: Asset,
  query: string,
  priorities: string[] = [],
  error?: string,
): SearchFurnitureProductsResult {
  return {
    source: "mock",
    query,
    products: sortProductOptionsForPriorities(
      getMockProductOptionsForAsset(asset),
      asset,
      priorities,
    ).slice(0, 3),
    error,
  };
}

function withMockResultSource(options: ProductOption[]) {
  return options.map((option) => ({
    ...option,
    resultSource: "mock" as const,
  }));
}

export function extractPrice(text: string): number | undefined {
  const patterns = [
    /£\s*([0-9][0-9,]*(?:\.\d{1,2})?)/i,
    /GBP\s*([0-9][0-9,]*(?:\.\d{1,2})?)/i,
    /([0-9][0-9,]*(?:\.\d{1,2})?)\s*GBP/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const value = Number.parseFloat(match[1].replace(/,/g, ""));
      if (Number.isFinite(value)) return Math.round(value);
    }
  }

  return undefined;
}

export function extractDimensions(
  text: string,
): ProductOption["dimensions"] | undefined {
  const compact = text.match(
    /(\d{2,3})\s*[x×]\s*(\d{2,3})(?:\s*[x×]\s*(\d{2,3}))?\s*cm/i,
  );
  if (compact) {
    return {
      width: Number(compact[1]),
      depth: Number(compact[2]),
      height: compact[3] ? Number(compact[3]) : undefined,
      unit: "cm",
    };
  }

  const labelled = text.match(
    /W\s*(\d{2,3})\s*(?:cm)?[\s,;/]+D\s*(\d{2,3})\s*(?:cm)?(?:[\s,;/]+H\s*(\d{2,3})\s*(?:cm)?)?/i,
  );
  if (labelled) {
    return {
      width: Number(labelled[1]),
      depth: Number(labelled[2]),
      height: labelled[3] ? Number(labelled[3]) : undefined,
      unit: "cm",
    };
  }

  return undefined;
}

export function calculateTotal(price = 0, delivery = 15) {
  return price + delivery;
}

export function getDomainRetailer(url: string) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    if (hostname.includes("amazon.co.uk")) return "Amazon";
    if (hostname.includes("ikea.com")) return "IKEA";
    if (hostname.includes("wayfair.co.uk")) return "Wayfair";
    if (hostname.includes("dunelm.com")) return "Dunelm";
    if (hostname.includes("johnlewis.com")) return "John Lewis";
    if (hostname.includes("temu.com")) return "Temu";
    if (hostname.includes("taobao.com")) return "Taobao";

    const domain = hostname.split(".")[0];
    return domain
      ? domain.charAt(0).toUpperCase() + domain.slice(1)
      : "Web result";
  } catch {
    return "Web result";
  }
}

function getFallbackDimensions(asset: Asset): ProductOption["dimensions"] {
  const size = asset.adaptedSize ?? asset.dimensions ?? asset.originalSize;
  return {
    width: size?.width ?? 100,
    depth: size?.depth ?? 60,
    height: size?.height,
    unit: "cm",
  };
}

function getDeliveryForCategory(asset: Asset) {
  if (asset.category === "sofa") return 29;
  if (asset.category === "rug") return 9;
  if (asset.category === "floor-lamp") return 8;
  return 15;
}

function estimatedPriceByCategory(category: string) {
  switch (String(category)) {
    case "sofa":
    case "seating":
      return 329;
    case "coffee-table":
    case "coffee_table":
    case "tables":
      return 89;
    case "floor-lamp":
    case "floor_lamp":
    case "lighting":
      return 49;
    case "rug":
    case "rugs":
      return 79;
    case "tv-stand":
    case "tv_stand":
    case "storage":
      return 149;
    default:
      return 99;
  }
}

function dimensionDistance(
  dimensions: ProductOption["dimensions"],
  target: ProductOption["dimensions"],
) {
  const width = Math.abs(dimensions.width - target.width);
  const depth = Math.abs(dimensions.depth - target.depth);
  const height = Math.abs(
    (dimensions.height ?? target.height ?? 0) -
      (target.height ?? dimensions.height ?? 0),
  );
  return width + depth + height;
}

function buildSearchQuery(asset: Asset, room?: Room | null) {
  const size = asset.adaptedSize ?? asset.dimensions ?? asset.originalSize;
  const parts = [
    getAssetColour(asset),
    asset.name,
    asset.material,
    asset.category.replace(/[-_]/g, " "),
    "UK",
    "furniture",
  ];

  if (size?.width) parts.push(`${Math.round(size.width)}cm`);
  if (room?.budget) parts.push(`under ${room.budget} GBP`);

  return parts.filter(Boolean).join(" ");
}

function getCandidateArrays(data: unknown): unknown[][] {
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  const direct = [
    record.organic,
    record.results,
    record.items,
    record.search_results,
    record.shopping_results,
    record.shopping,
  ].filter(Array.isArray) as unknown[][];

  if ("data" in record && record.data && typeof record.data === "object") {
    return [...direct, ...getCandidateArrays(record.data)];
  }

  return direct;
}

function hasCandidateFields(item: unknown) {
  if (!item || typeof item !== "object") return false;
  const record = item as Record<string, unknown>;
  return Boolean(
    (record.title || record.name || record.product_title || record.heading) &&
      (record.link || record.url || record.product_link || record.href),
  );
}

function findRecursiveCandidateArrays(data: unknown, depth = 0): unknown[][] {
  if (!data || typeof data !== "object" || depth > 5) return [];
  if (Array.isArray(data)) {
    const objectItems = data.filter((item) => item && typeof item === "object");
    const hasResults = objectItems.some(hasCandidateFields);
    const nested = objectItems.flatMap((item) => findRecursiveCandidateArrays(item, depth + 1));
    return hasResults ? [data, ...nested] : nested;
  }

  return Object.values(data as Record<string, unknown>).flatMap((value) =>
    findRecursiveCandidateArrays(value, depth + 1),
  );
}

function getCandidates(rawData: unknown) {
  const direct = getCandidateArrays(rawData).flat();
  const recursive = findRecursiveCandidateArrays(rawData).flat();
  if (direct.length === 0) return recursive;

  const seen = new Set<unknown>();
  return [...direct, ...recursive].filter((item) => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}

function logBrightDataShape(rawData: unknown, candidates: unknown[]) {
  if (!rawData || typeof rawData !== "object") {
    console.log("Bright Data response top-level keys", []);
    console.log("Bright Data first candidates", []);
    return;
  }

  console.log("Bright Data response top-level keys", Object.keys(rawData as Record<string, unknown>));
  console.log("Bright Data first candidates", candidates.slice(0, 2));
}

function getItemPrice(item: SearchResultItem, text: string) {
  const rawPrice = item.price ?? item.extracted_price ?? item.price_value;

  if (typeof rawPrice === "number" && Number.isFinite(rawPrice)) return Math.round(rawPrice);
  if (typeof rawPrice === "string") {
    const direct = Number.parseFloat(rawPrice.replace(/[£,\s]/g, ""));
    if (Number.isFinite(direct)) return Math.round(direct);
    return extractPrice(rawPrice) ?? extractPrice(text);
  }
  if (rawPrice && typeof rawPrice === "object") {
    const value = rawPrice.value ?? rawPrice.amount;
    if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
    if (typeof value === "string") {
      const parsed = Number.parseFloat(value.replace(/[£,\s]/g, ""));
      if (Number.isFinite(parsed)) return Math.round(parsed);
    }
  }

  return extractPrice(text);
}

function assignResultTypes(products: ProductOption[], asset: Asset) {
  const targetDimensions = getFallbackDimensions(asset);
  const cheapestId = [...products].sort((a, b) => a.total - b.total)[0]?.id;
  const bestFitId = [...products].sort(
    (a, b) => dimensionDistance(a.dimensions, targetDimensions) - dimensionDistance(b.dimensions, targetDimensions),
  )[0]?.id;
  const closestId = products[0]?.id;
  const usedTypes = new Set<ProductOption["type"]>();

  return products.map((product, index) => {
    let type: ProductOption["type"] | undefined;
    if (product.id === cheapestId && !usedTypes.has("best_budget")) type = "best_budget";
    else if (product.id === bestFitId && !usedTypes.has("best_fit")) type = "best_fit";
    else if (product.id === closestId && !usedTypes.has("closest_match")) type = "closest_match";

    if (!type) {
      type = (["best_budget", "best_fit", "closest_match"] as const).find((candidate) => !usedTypes.has(candidate)) ?? "closest_match";
    }

    usedTypes.add(type);
    return {
      ...product,
      id: product.resultSource === "mock" ? `${product.id}-fill-${index}` : product.id,
      type,
    };
  });
}

function normalizeBrightDataProducts(
  asset: Asset,
  rawData: unknown,
  priorities: string[] = [],
): ProductOption[] {
  const targetDimensions = getFallbackDimensions(asset);
  const candidates = getCandidates(rawData);
  logBrightDataShape(rawData, candidates);
  const items = candidates.filter((item): item is SearchResultItem =>
    Boolean(item && typeof item === "object"),
  );

  const products = items
    .map((item, index): ProductOption | null => {
      const title = item.title ?? item.name ?? item.product_title ?? item.heading;
      const url = item.link ?? item.url ?? item.product_link ?? item.href;
      if (!title || !url) return null;

      const text = [title, item.description, item.snippet, item.text, item.content]
        .filter(Boolean)
        .join(" ");
      const price = getItemPrice(item, text);
      const priceIsEstimated = price === undefined;
      const finalPrice = price ?? estimatedPriceByCategory(asset.category);
      const delivery = getDeliveryForCategory(asset);
      const extractedDimensions = extractDimensions(text);
      const dimensions = extractedDimensions ?? targetDimensions;
      const dimensionsAreEstimated = !extractedDimensions;
      const retailer =
        item.source ??
        item.displayed_link ??
        item.domain ??
        getDomainRetailer(url);
      const reason = [
        "Live web result ranked against your shopping priorities.",
        priceIsEstimated
          ? "Price estimated because public search result did not include a price."
          : undefined,
        dimensionsAreEstimated
          ? "Dimensions matched against adapted asset size."
          : undefined,
      ]
        .filter(Boolean)
        .join(" ");

      return {
        id: `${asset.id}-bright-${index}`,
        assetId: asset.id,
        type: "closest_match",
        productName: title,
        retailer,
        source: "Bright Data",
        price: finalPrice,
        delivery,
        total: calculateTotal(finalPrice, delivery),
        dimensions,
        url,
        reason,
        fitStatus:
          dimensionDistance(dimensions, targetDimensions) <= 30
            ? "good"
            : "warning",
        doorwayStatus:
          asset.doorwayStatus === "failed"
            ? "failed"
            : asset.doorwayStatus === "caution"
              ? "risk"
              : "passed",
        resultSource: "bright_data",
        priceIsEstimated,
        dimensionsAreEstimated,
      };
    })
    .filter((product): product is ProductOption => Boolean(product));

  if (priorities[0] === "Price") {
    products.sort(
      (a, b) =>
        (a.total || Number.MAX_SAFE_INTEGER) -
        (b.total || Number.MAX_SAFE_INTEGER),
    );
  } else if (priorities[0] === "Size fit") {
    products.sort(
      (a, b) =>
        dimensionDistance(a.dimensions, targetDimensions) -
        dimensionDistance(b.dimensions, targetDimensions),
    );
  }

  const liveProducts = products.slice(0, 3);
  if (liveProducts.length === 0) return [];

  const mockFillers = withMockResultSource(
    sortProductOptionsForPriorities(getMockProductOptionsForAsset(asset), asset, priorities),
  )
    .filter((mock) => !liveProducts.some((live) => live.url === mock.url))
    .slice(0, Math.max(0, 3 - liveProducts.length));

  return assignResultTypes([...liveProducts, ...mockFillers].slice(0, 3), asset);
}

export async function searchFurnitureProducts({
  asset,
  room,
  priorities = [],
}: SearchFurnitureProductsParams): Promise<SearchFurnitureProductsResult> {
  const query = buildSearchQuery(asset, room);
  const apiKey = process.env.BRIGHT_DATA_API_KEY;

  if (!apiKey) {
    return fallback(
      asset,
      query,
      priorities,
      "Bright Data API key is not configured.",
    );
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        zone: "serp_api1",
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        format: "json",
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Bright Data error", response.status, errorText);
      return fallback(
        asset,
        query,
        priorities,
        `Bright Data request failed with ${response.status}: ${errorText.slice(0, 300)}`,
      );
    }

    const data = await response.json();
    const products = normalizeBrightDataProducts(asset, data, priorities);

    if (products.length === 0) {
      return fallback(
        asset,
        query,
        priorities,
        "No valid Bright Data products found.",
      );
    }

    return {
      source: "bright_data",
      query,
      products,
    };
  } catch (error) {
    return fallback(
      asset,
      query,
      priorities,
      error instanceof Error ? error.message : "Bright Data request failed.",
    );
  }
}
