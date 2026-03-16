import type { StepFormData } from "@/types/forms";

export type StepInputProps = {
  step: StepFormData;
  index: number;
  canDelete: boolean;
  onUpdate: (index: number, field: "instruction" | "timerSeconds", value: string) => void;
  onRemove: (index: number) => void;
};
