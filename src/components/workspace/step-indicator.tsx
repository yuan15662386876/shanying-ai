"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
  { num: 1, label: "内容抓取" },
  { num: 2, label: "AI改写" },
  { num: 3, label: "声音合成" },
  { num: 4, label: "数字人" },
  { num: 5, label: "视频合成" },
];

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                step.num < currentStep &&
                  "bg-green-500/20 text-green-400 border border-green-500/30",
                step.num === currentStep &&
                  "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20",
                step.num > currentStep &&
                  "bg-secondary text-muted-foreground border border-border"
              )}
            >
              {step.num < currentStep ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                step.num
              )}
            </div>
            <span
              className={cn(
                "mt-1.5 text-[10px] whitespace-nowrap",
                step.num === currentStep
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "h-px w-8 sm:w-12 mx-1 mt-[-16px] transition-colors duration-300",
                step.num < currentStep ? "bg-green-500/30" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
