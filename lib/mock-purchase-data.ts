import type { Asset } from './types';

export interface PurchaseOption {
  id: string;
  assetId: string;
  type: 'best_budget' | 'best_fit' | 'closest_match' | 'custom';
  retailer: string;
  source: string;
  productName: string;
  price: number;
  delivery: number;
  total: number;
  dimensions: {
    width: number;
    depth: number;
    height?: number;
    unit: 'cm';
  };
  url: string;
  reason: string;
  fitStatus: 'good' | 'warning' | 'too_large';
  doorwayStatus: 'passed' | 'risk' | 'failed';
  resultSource?: 'bright_data' | 'mock';
  priceIsEstimated?: boolean;
  dimensionsAreEstimated?: boolean;
}

export interface FurniturePurchaseGroup {
  asset: Asset;
  options: PurchaseOption[];
}

export type ProductOption = PurchaseOption;

function dimensionDistance(option: PurchaseOption, asset: Asset) {
  const target = asset.adaptedSize ?? asset.dimensions ?? asset.originalSize;
  if (!target) return 0;

  return (
    Math.abs(option.dimensions.width - target.width) +
    Math.abs(option.dimensions.depth - target.depth) +
    Math.abs((option.dimensions.height ?? target.height ?? 0) - (target.height ?? option.dimensions.height ?? 0))
  );
}

export function sortProductOptionsForPriorities(
  options: PurchaseOption[],
  asset: Asset,
  priorities: string[] = []
) {
  const sorted = [...options];

  if (priorities[0] === 'Price') {
    sorted.sort((a, b) => a.total - b.total);
  } else if (priorities[0] === 'Size fit') {
    sorted.sort((a, b) => dimensionDistance(a, asset) - dimensionDistance(b, asset));
  }

  return sorted;
}

function option(
  asset: Asset,
  data: Omit<PurchaseOption, 'id' | 'assetId' | 'retailer' | 'total' | 'fitStatus' | 'doorwayStatus'> & {
    idSuffix: string;
    retailer?: string;
  }
): PurchaseOption {
  return {
    id: `${asset.id}-${data.idSuffix}`,
    assetId: asset.id,
    type: data.type,
    retailer: data.retailer ?? data.source,
    source: data.source,
    productName: data.productName,
    price: data.price,
    delivery: data.delivery,
    total: data.price + data.delivery,
    dimensions: data.dimensions,
    url: data.url,
    reason: data.reason,
    fitStatus: asset.fitStatus === 'too-large' ? 'too_large' : asset.fitStatus === 'tight' ? 'warning' : 'good',
    doorwayStatus: asset.doorwayStatus === 'failed' ? 'failed' : asset.doorwayStatus === 'caution' ? 'risk' : 'passed',
    resultSource: 'mock',
  };
}

// Category-specific mock data
function sofaOptions(asset: Asset): PurchaseOption[] {
  return [
  option(asset, {
    idSuffix: 'budget',
    type: 'best_budget',
    source: 'Temu',
    productName: 'Compact Beige Sofa',
    price: 189,
    delivery: 12,
    dimensions: { width: 175, depth: 80, height: 75, unit: 'cm' },
    url: 'https://www.temu.com/search_result.html?search_key=compact%20beige%20sofa',
    reason: 'Lowest price while staying close to the warm beige style.',
  }),
  option(asset, {
    idSuffix: 'fit',
    type: 'best_fit',
    source: 'Amazon',
    productName: 'Small Space Beige Fabric Sofa',
    price: 329,
    delivery: 29,
    dimensions: { width: 180, depth: 82, height: 76, unit: 'cm' },
    url: 'https://www.amazon.co.uk/s?k=compact+beige+sofa',
    reason: 'Best fit for room size and doorway constraints.',
  }),
  option(asset, {
    idSuffix: 'match',
    type: 'closest_match',
    source: 'John Lewis',
    productName: 'Warm Beige 2-Seater Sofa',
    price: 549,
    delivery: 49,
    dimensions: { width: 185, depth: 85, height: 78, unit: 'cm' },
    url: 'https://www.johnlewis.com/search?search-term=beige%20sofa',
    reason: 'Closest colour and silhouette to the inspiration image.',
  }),
  ];
}

function coffeeTableOptions(asset: Asset): PurchaseOption[] {
  return [
  option(asset, {
    idSuffix: 'budget',
    type: 'best_budget',
    source: 'Temu',
    productName: 'Oak Effect Small Coffee Table',
    price: 39,
    delivery: 8,
    dimensions: { width: 85, depth: 50, height: 40, unit: 'cm' },
    url: 'https://www.temu.com/search_result.html?search_key=oak%20coffee%20table',
    reason: 'Lowest price option with similar oak tone.',
  }),
  option(asset, {
    idSuffix: 'fit',
    type: 'best_fit',
    source: 'Amazon',
    productName: 'Compact Oak Coffee Table',
    price: 79,
    delivery: 9,
    dimensions: { width: 90, depth: 55, height: 40, unit: 'cm' },
    url: 'https://www.amazon.co.uk/s?k=oak+coffee+table',
    reason: 'Best size match for the adapted room layout.',
  }),
  option(asset, {
    idSuffix: 'match',
    type: 'closest_match',
    source: 'Taobao',
    productName: 'Solid Wood Minimal Coffee Table',
    price: 119,
    delivery: 35,
    dimensions: { width: 95, depth: 55, height: 42, unit: 'cm' },
    url: 'https://s.taobao.com/search?q=oak%20coffee%20table',
    reason: 'Closest shape and material style.',
  }),
  ];
}

function floorLampOptions(asset: Asset): PurchaseOption[] {
  return [
  option(asset, {
    idSuffix: 'budget',
    type: 'best_budget',
    source: 'Temu',
    productName: 'Warm Cream Floor Lamp',
    price: 25,
    delivery: 6,
    dimensions: { width: 30, depth: 30, height: 145, unit: 'cm' },
    url: 'https://www.temu.com/search_result.html?search_key=cream%20floor%20lamp',
    reason: 'Lowest price for a similar warm lighting effect.',
  }),
  option(asset, {
    idSuffix: 'fit',
    type: 'best_fit',
    source: 'Amazon',
    productName: 'Slim Floor Lamp for Small Living Room',
    price: 45,
    delivery: 5,
    dimensions: { width: 35, depth: 35, height: 150, unit: 'cm' },
    url: 'https://www.amazon.co.uk/s?k=cream+floor+lamp',
    reason: 'Best fit for the corner placement.',
  }),
  option(asset, {
    idSuffix: 'match',
    type: 'closest_match',
    source: 'IKEA',
    productName: 'Soft Shade Floor Lamp',
    price: 69,
    delivery: 9,
    dimensions: { width: 38, depth: 38, height: 155, unit: 'cm' },
    url: 'https://www.ikea.com/gb/en/search/?q=floor%20lamp',
    reason: 'Closest warm minimal lighting style.',
  }),
  ];
}

function rugOptions(asset: Asset): PurchaseOption[] {
  return [
  option(asset, {
    idSuffix: 'budget',
    type: 'best_budget',
    source: 'Temu',
    productName: 'Neutral Flatweave Rug',
    price: 29,
    delivery: 7,
    dimensions: { width: 180, depth: 130, unit: 'cm' },
    url: 'https://www.temu.com/search_result.html?search_key=neutral%20rug',
    reason: 'Lowest price neutral rug option.',
  }),
  option(asset, {
    idSuffix: 'fit',
    type: 'best_fit',
    source: 'Amazon',
    productName: 'Cream Living Room Rug',
    price: 49,
    delivery: 9,
    dimensions: { width: 200, depth: 140, unit: 'cm' },
    url: 'https://www.amazon.co.uk/s?k=cream+living+room+rug',
    reason: 'Best match for the adapted rug size.',
  }),
  option(asset, {
    idSuffix: 'match',
    type: 'closest_match',
    source: 'Dunelm',
    productName: 'Warm Minimal Wool Rug',
    price: 119,
    delivery: 15,
    dimensions: { width: 210, depth: 150, unit: 'cm' },
    url: 'https://www.dunelm.com/search?q=cream%20rug',
    reason: 'Closest material and warm minimal look.',
  }),
  ];
}

function tvStandOptions(asset: Asset): PurchaseOption[] {
  return [
  option(asset, {
    idSuffix: 'budget',
    type: 'best_budget',
    source: 'Temu',
    productName: 'Compact Low TV Bench',
    price: 59,
    delivery: 12,
    dimensions: { width: 120, depth: 38, height: 42, unit: 'cm' },
    url: 'https://www.temu.com/search_result.html?search_key=low%20tv%20stand',
    reason: 'Lowest price compact storage option.',
  }),
  option(asset, {
    idSuffix: 'fit',
    type: 'best_fit',
    source: 'Amazon',
    productName: 'Low Oak TV Stand',
    price: 129,
    delivery: 19,
    dimensions: { width: 138, depth: 40, height: 45, unit: 'cm' },
    url: 'https://www.amazon.co.uk/s?k=low+oak+tv+stand',
    reason: 'Best width fit under the adapted 140cm requirement.',
  }),
  option(asset, {
    idSuffix: 'match',
    type: 'closest_match',
    source: 'Wayfair',
    productName: 'Warm Oak Media Unit',
    price: 179,
    delivery: 29,
    dimensions: { width: 140, depth: 40, height: 45, unit: 'cm' },
    url: 'https://www.wayfair.co.uk/keyword.php?keyword=oak+tv+stand',
    reason: 'Closest material and proportions.',
  }),
  ];
}

// Default options for unknown categories
function defaultOptions(asset: Asset): PurchaseOption[] {
  return [
  option(asset, {
    idSuffix: 'budget',
    type: 'best_budget',
    source: 'Temu',
    productName: 'Budget Item',
    price: 99,
    delivery: 10,
    dimensions: { width: 100, depth: 100, height: 100, unit: 'cm' },
    url: 'https://www.temu.com/search_result.html?search_key=item',
    reason: 'Most affordable option.',
  }),
  option(asset, {
    idSuffix: 'fit',
    type: 'best_fit',
    source: 'Amazon',
    productName: 'Popular Item',
    price: 199,
    delivery: 15,
    dimensions: { width: 110, depth: 110, height: 110, unit: 'cm' },
    url: 'https://www.amazon.co.uk/s?k=item',
    reason: 'Best value for money.',
  }),
  option(asset, {
    idSuffix: 'match',
    type: 'closest_match',
    source: 'IKEA',
    productName: 'Premium Item',
    price: 299,
    delivery: 20,
    dimensions: { width: 120, depth: 120, height: 120, unit: 'cm' },
    url: 'https://www.ikea.com/gb/en/search/?q=item',
    reason: 'Highest quality option.',
  }),
  ];
}

export function getMockProductOptionsForAsset(asset: Asset): PurchaseOption[] {
  switch (String(asset.category)) {
    case 'sofa':
    case 'seating':
      return sofaOptions(asset);
    case 'coffee-table':
    case 'coffee_table':
    case 'tables':
      return coffeeTableOptions(asset);
    case 'floor-lamp':
    case 'floor_lamp':
    case 'lighting':
      return floorLampOptions(asset);
    case 'rug':
    case 'rugs':
      return rugOptions(asset);
    case 'tv-stand':
    case 'tv_stand':
    case 'storage':
      return tvStandOptions(asset);
    default:
      return defaultOptions(asset);
  }
}

export function generateMockPurchaseOptions(
  assets: Asset[],
  selectedAssetIds?: Set<string>,
  priorities: string[] = []
): FurniturePurchaseGroup[] {
  const assetsToProcess = selectedAssetIds
    ? assets.filter((a) => selectedAssetIds.has(a.id))
    : assets;

  return assetsToProcess.map((asset) => ({
    asset,
    options: sortProductOptionsForPriorities(getMockProductOptionsForAsset(asset), asset, priorities),
  }));
}
