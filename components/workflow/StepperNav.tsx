"use client";

import { cn } from "@/lib/utils";
import { useWorkflow } from "@/lib/workflow-context";
import { Check } from "lucide-react";

const STEPS = [
  { id: 1, name: "Room" },
  { id: 2, name: "Inspiration" },
  { id: 3, name: "Assets" },
  { id: 4, name: "Library" },
  { id: 5, name: "Preview" },
  { id: 6, name: "Buy" },
  { id: 7, name: "Checkout" },
];

export function StepperNav() {
  const { state, goToStep } = useWorkflow();
  const currentStep = state.currentStep;

  return (
    <nav className="flex items-center gap-1 sm:gap-2">
      {STEPS.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isClickable = step.id <= currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => isClickable && goToStep(step.id)}
              disabled={!isClickable}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1.5 rounded-full text-sm font-medium transition-all",
                isActive && "bg-stone-900 text-white",
                isCompleted && "bg-stone-100 text-stone-700 hover:bg-stone-200",
                !isActive && !isCompleted && "text-stone-400 cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-full text-xs",
                  isActive && "bg-white text-stone-900",
                  isCompleted && "bg-stone-700 text-white",
                  !isActive && !isCompleted && "bg-stone-200 text-stone-400"
                )}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : step.id}
              </span>
              <span className="hidden sm:inline">{step.name}</span>
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-4 sm:w-8 h-0.5 mx-1",
                  step.id < currentStep ? "bg-stone-700" : "bg-stone-200"
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
