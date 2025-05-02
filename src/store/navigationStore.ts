import { create } from 'zustand'

export type NavigationStep = 'show' | 'occurrence' | 'dates'

interface NavigationState {
  activeStep: NavigationStep
  setActiveStep: (step: NavigationStep) => void
  steps: Array<{
    id: NavigationStep
    label: string
  }>
}

export const useNavigationStore = create<NavigationState>()((set) => ({
  activeStep: 'show',
  setActiveStep: (step: NavigationStep) => set({ activeStep: step }),
  steps: [
    { id: 'show', label: 'Show' },
    { id: 'occurrence', label: 'Show Occurrence' },
    { id: 'dates', label: 'Show Dates' }
  ]
})) 