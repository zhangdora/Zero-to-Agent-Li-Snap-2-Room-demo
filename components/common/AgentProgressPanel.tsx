"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, ImageIcon, Layers, Ruler, DoorOpen, Sparkles, Box } from "lucide-react";
import { cn } from "@/lib/utils";

const PROGRESS_STEPS = [
  { id: 1, label: "Reading inspiration image", icon: ImageIcon },
  { id: 2, label: "Extracting furniture assets", icon: Layers },
  { id: 3, label: "Adapting to room dimensions", icon: Ruler },
  { id: 4, label: "Checking doorway fit", icon: DoorOpen },
  { id: 5, label: "Curating fewer, better options", icon: Sparkles },
  { id: 6, label: "Preparing 3D preview", icon: Box },
];

export function AgentProgressPanel() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < PROGRESS_STEPS.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 100));
    }, 50);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto py-12">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-stone-900 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-stone-900">Analyzing Your Inspiration</h3>
            <p className="text-stone-500 mt-1">This will only take a moment</p>
          </div>

          <Progress value={progress} className="mb-6" />

          <div className="space-y-3">
            {PROGRESS_STEPS.map((step) => {
              const isComplete = step.id <= currentStep;
              const isActive = step.id === currentStep + 1;
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all",
                    isComplete && "bg-green-50",
                    isActive && "bg-amber-50",
                    !isComplete && !isActive && "opacity-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      isComplete && "bg-green-500 text-white",
                      isActive && "bg-amber-400 text-white",
                      !isComplete && !isActive && "bg-stone-200 text-stone-400"
                    )}
                  >
                    {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isComplete && "text-green-700",
                      isActive && "text-amber-700",
                      !isComplete && !isActive && "text-stone-400"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
