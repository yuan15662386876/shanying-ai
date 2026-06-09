"use client";

import { useWorkspaceStore } from "@/stores/workspace-store";
import { StepIndicator } from "@/components/workspace/step-indicator";
import { Step1Content } from "@/components/workspace/step1-content";
import { Step2Rewrite } from "@/components/workspace/step2-rewrite";
import { Step3Voice } from "@/components/workspace/step3-voice";
import { Step4Avatar } from "@/components/workspace/step4-avatar";
import { Step5Generate } from "@/components/workspace/step5-generate";

export default function WorkspacePage() {
  const { currentStep } = useWorkspaceStore();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">创作工作台</h1>
        <p className="mt-2 text-muted-foreground">
          5步完成营销视频创作
        </p>
      </div>

      {/* Step Progress */}
      <div className="mb-8">
        <StepIndicator currentStep={currentStep} />
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && <Step1Content />}
        {currentStep === 2 && <Step2Rewrite />}
        {currentStep === 3 && <Step3Voice />}
        {currentStep === 4 && <Step4Avatar />}
        {currentStep === 5 && <Step5Generate />}
      </div>
    </div>
  );
}
