"use client";

import { StepperNav } from "./StepperNav";
import { Home } from "lucide-react";

export function HeaderPanel() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="flex flex-col gap-4 px-6 py-4">
        {/* Top row: Brand + Story */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-stone-900 text-white">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-stone-900">Snap2Room</h1>
              <p className="text-sm text-stone-500">
                Start with what you love. Fine-tune it to fit your home.
              </p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs text-stone-400">Before: I like it. I want it. I can&apos;t get it.</p>
            <p className="text-xs font-medium text-stone-600">
              After: I like it. I want it. AI helps me get it.
            </p>
          </div>
        </div>

        {/* Bottom row: Stepper */}
        <div className="flex justify-center overflow-x-auto">
          <StepperNav />
        </div>
      </div>
    </header>
  );
}
