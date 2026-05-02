"use client";

import type { ReactNode } from "react";
import { HeaderPanel } from "./HeaderPanel";

interface WorkflowShellProps {
  leftPanel?: ReactNode;
  mainPanel: ReactNode;
  rightPanel?: ReactNode;
}

export function WorkflowShell({ leftPanel, mainPanel, rightPanel }: WorkflowShellProps) {
  return (
    <div className="flex flex-col h-screen bg-stone-50">
      <HeaderPanel />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        {leftPanel && (
          <aside className="hidden lg:flex flex-col w-72 border-r border-stone-200 bg-white overflow-y-auto">
            {leftPanel}
          </aside>
        )}

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{mainPanel}</div>
        </main>

        {/* Right Panel */}
        {rightPanel && (
          <aside className="hidden xl:flex flex-col w-80 border-l border-stone-200 bg-white overflow-y-auto">
            {rightPanel}
          </aside>
        )}
      </div>
    </div>
  );
}
