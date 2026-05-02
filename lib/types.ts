// Snap2Room TypeScript Types

export type RoomType = "living-room";

export type DoorPosition = "front" | "back" | "left" | "right";

export type FitStatus = "good" | "tight" | "too-large";

export type DoorwayStatus = "passed" | "caution" | "failed";

export type AssetCategory =
  | "sofa"
  | "coffee-table"
  | "floor-lamp"
  | "rug"
  | "tv-stand";

export type ProductMatchType = "closest" | "budget" | "best-fit";

export interface Dimensions {
  width: number;
  depth: number;
  height: number;
}

export interface Room {
  type: RoomType;
  name?: string;
  dimensions: Dimensions;
  doorway?: {
    width: number;
    height: number;
  };
  door?: {
    width: number;
    height: number;
    position: DoorPosition;
  };
  budget: number;
  assets?: Asset[];
}

export interface DetectedStyle {
  style: string;
  colors: string[];
  materials: string[];
  layout: string;
}

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  source: string;
  originalSize?: Dimensions;
  adaptedSize?: Dimensions;
  dimensions?: Dimensions;
  color?: string;
  material?: string;
  style?: string;
  fitStatus?: FitStatus;
  doorwayStatus?: DoorwayStatus;
  inLibrary?: boolean;
  placedInRoom?: boolean;
  position?: { x: number; y: number };
  lowestPrice?: number;
}

export interface Product {
  id: string;
  assetId: string;
  name: string;
  retailer: string;
  price: number;
  dimensions: Dimensions;
  fitStatus: FitStatus;
  doorwayStatus: DoorwayStatus;
  matchType: ProductMatchType;
  matchReason: string;
  inOrder: boolean;
}

export interface CustomQuote {
  assetId: string;
  assetName: string;
  estimatedPriceRange: string;
  reason: string;
  requested: boolean;
}

export interface OrderSummary {
  products: Product[];
  customQuotes: CustomQuote[];
  totalCost: number;
  allDoorwayPassed: boolean;
  allFitGood: boolean;
}

export interface RoomPreviewItem {
  asset: Asset;
  x: number;
  y: number;
  zIndex: number;
}

export interface WorkflowStep {
  id: number;
  name: string;
  slug: string;
  completed: boolean;
  active: boolean;
}

export interface WorkflowState {
  currentStep: number;
  room: Room;
  inspirationUploaded: boolean;
  detectedStyle: DetectedStyle | null;
  assets: Asset[];
  library: Asset[];
  roomPreview: RoomPreviewItem[];
  products: Product[];
  customQuotes: CustomQuote[];
  order: OrderSummary | null;
  orderPlaced: boolean;
}

export type WorkflowAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "UPDATE_ROOM"; payload: Partial<Room> }
  | { type: "SET_INSPIRATION_UPLOADED"; payload: boolean }
  | { type: "SET_DETECTED_STYLE"; payload: DetectedStyle }
  | { type: "SET_ASSETS"; payload: Asset[] }
  | { type: "ADD_TO_LIBRARY"; payload: string }
  | { type: "ADD_ALL_TO_LIBRARY" }
  | { type: "REMOVE_FROM_LIBRARY"; payload: string }
  | { type: "ADD_ASSET"; payload: Asset }
  | { type: "REMOVE_ASSET"; payload: string }
  | { type: "PLACE_IN_ROOM"; payload: string }
  | { type: "REMOVE_FROM_ROOM"; payload: string }
  | { type: "ADD_TO_ORDER"; payload: string }
  | { type: "REMOVE_FROM_ORDER"; payload: string }
  | { type: "REQUEST_CUSTOM_QUOTE"; payload: string }
  | { type: "PLACE_ORDER" }
  | { type: "RESET" };

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { id: 1, name: "Room", slug: "room", completed: false, active: true },
  { id: 2, name: "Inspiration", slug: "inspiration", completed: false, active: false },
  { id: 3, name: "Assets", slug: "assets", completed: false, active: false },
  { id: 4, name: "Library", slug: "library", completed: false, active: false },
  { id: 5, name: "Preview", slug: "preview", completed: false, active: false },
  { id: 6, name: "Buy", slug: "buy", completed: false, active: false },
  { id: 7, name: "Checkout", slug: "checkout", completed: false, active: false },
];
