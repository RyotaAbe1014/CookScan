export type Step = {
  id?: string
  instruction: string
  timerSeconds?: number
}

export type StepInputProps = {
  step: Step
  index: number
  canDelete: boolean
  onUpdate: (index: number, field: 'instruction' | 'timerSeconds', value: string) => void
  onRemove: (index: number) => void
}
