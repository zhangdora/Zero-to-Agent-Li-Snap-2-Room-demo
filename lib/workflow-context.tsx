"use client";

import React, { createContext, useContext, useReducer, type ReactNode } from "react";
import type { WorkflowState, WorkflowAction } from "./types";
import { INITIAL_WORKFLOW_STATE, MOCK_ASSETS, MOCK_DETECTED_STYLE } from "./mock-data";

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload };

    case "NEXT_STEP":
      return { ...state, currentStep: Math.min(state.currentStep + 1, 7) };

    case "PREV_STEP":
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };

    case "UPDATE_ROOM":
      return { ...state, room: { ...state.room, ...action.payload } };

    case "SET_INSPIRATION_UPLOADED":
      return { ...state, inspirationUploaded: action.payload };

    case "SET_DETECTED_STYLE":
      return { ...state, detectedStyle: action.payload };

    case "SET_ASSETS":
      return { ...state, assets: action.payload };

    case "ADD_TO_LIBRARY": {
      const asset = state.assets.find((a) => a.id === action.payload);
      if (!asset || asset.inLibrary) return state;
      const updatedAssets = state.assets.map((a) =>
        a.id === action.payload ? { ...a, inLibrary: true } : a
      );
      return {
        ...state,
        assets: updatedAssets,
        library: [...state.library, { ...asset, inLibrary: true }],
      };
    }

    case "ADD_ALL_TO_LIBRARY": {
      const newLibraryAssets = state.assets
        .filter((a) => !a.inLibrary)
        .map((a) => ({ ...a, inLibrary: true }));
      const updatedAssets = state.assets.map((a) => ({ ...a, inLibrary: true }));
      return {
        ...state,
        assets: updatedAssets,
        library: [...state.library, ...newLibraryAssets],
      };
    }

    case "REMOVE_FROM_LIBRARY": {
      const updatedAssets = state.assets.map((a) =>
        a.id === action.payload ? { ...a, inLibrary: false, placedInRoom: false } : a
      );
      return {
        ...state,
        assets: updatedAssets,
        library: state.library.filter((a) => a.id !== action.payload),
        roomPreview: state.roomPreview.filter((r) => r.asset.id !== action.payload),
      };
    }

    case "ADD_ASSET": {
      if (!state.room) return state;
      const newRoom = {
        ...state.room,
        assets: [...state.room.assets, { ...action.payload, placedInRoom: true }],
      };
      return { ...state, room: newRoom };
    }

    case "REMOVE_ASSET": {
      if (!state.room) return state;
      const newRoom = {
        ...state.room,
        assets: state.room.assets.filter((a) => a.id !== action.payload),
      };
      return { ...state, room: newRoom };
    }

    case "PLACE_IN_ROOM": {
      const asset = state.library.find((a) => a.id === action.payload);
      if (!asset || asset.placedInRoom) return state;
      const updatedLibrary = state.library.map((a) =>
        a.id === action.payload ? { ...a, placedInRoom: true } : a
      );
      const updatedAssets = state.assets.map((a) =>
        a.id === action.payload ? { ...a, placedInRoom: true } : a
      );
      return {
        ...state,
        assets: updatedAssets,
        library: updatedLibrary,
        roomPreview: [
          ...state.roomPreview,
          { asset: { ...asset, placedInRoom: true }, x: 100, y: 100, zIndex: state.roomPreview.length + 1 },
        ],
      };
    }

    case "REMOVE_FROM_ROOM": {
      const updatedLibrary = state.library.map((a) =>
        a.id === action.payload ? { ...a, placedInRoom: false } : a
      );
      const updatedAssets = state.assets.map((a) =>
        a.id === action.payload ? { ...a, placedInRoom: false } : a
      );
      return {
        ...state,
        assets: updatedAssets,
        library: updatedLibrary,
        roomPreview: state.roomPreview.filter((r) => r.asset.id !== action.payload),
      };
    }

    case "ADD_TO_ORDER": {
      const updatedProducts = state.products.map((p) =>
        p.id === action.payload ? { ...p, inOrder: true } : p
      );
      return { ...state, products: updatedProducts };
    }

    case "REMOVE_FROM_ORDER": {
      const updatedProducts = state.products.map((p) =>
        p.id === action.payload ? { ...p, inOrder: false } : p
      );
      return { ...state, products: updatedProducts };
    }

    case "REQUEST_CUSTOM_QUOTE": {
      const updatedQuotes = state.customQuotes.map((q) =>
        q.assetId === action.payload ? { ...q, requested: true } : q
      );
      return { ...state, customQuotes: updatedQuotes };
    }

    case "PLACE_ORDER": {
      const orderedProducts = state.products.filter((p) => p.inOrder);
      const requestedQuotes = state.customQuotes.filter((q) => q.requested);
      const totalCost = orderedProducts.reduce((sum, p) => sum + p.price, 0);
      return {
        ...state,
        orderPlaced: true,
        order: {
          products: orderedProducts,
          customQuotes: requestedQuotes,
          totalCost,
          allDoorwayPassed: orderedProducts.every((p) => p.doorwayStatus === "passed"),
          allFitGood: orderedProducts.every((p) => p.fitStatus === "good"),
        },
      };
    }

    case "RESET":
      return INITIAL_WORKFLOW_STATE;

    default:
      return state;
  }
}

interface WorkflowContextValue {
  state: WorkflowState;
  dispatch: React.Dispatch<WorkflowAction>;
  generateAssets: () => void;
  goToStep: (step: number) => void;
}

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, INITIAL_WORKFLOW_STATE);

  const generateAssets = () => {
    dispatch({ type: "SET_DETECTED_STYLE", payload: MOCK_DETECTED_STYLE });
    dispatch({ type: "SET_ASSETS", payload: MOCK_ASSETS });
  };

  const goToStep = (step: number) => {
    dispatch({ type: "SET_STEP", payload: step });
  };

  return (
    <WorkflowContext.Provider value={{ state, dispatch, generateAssets, goToStep }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
}
