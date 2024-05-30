import {
  ReactNode,
  createContext,
  useState,
  useReducer,
  useEffect,
} from 'react'
import { Cycle, CyclesReducer } from '../reducers/cycles/reducer'
import {
  AddNewCycleAction,
  InterrupteCurrentCycleAction,
  MarCurrentCycleasFinishedAction,
} from '../reducers/cycles/actions'
import { differenceInSeconds } from 'date-fns'
interface CreateCycleData {
  task: string
  minutesAmount: number
}

export interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCicle: (data: CreateCycleData) => void
  interruptCurrentNewCicle: () => void
}

interface CyclesContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    CyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (inicialState) => {
      const storageStateJSON = localStorage.getItem(
        '@ignite-timer:cycle-state-1.0.0',
      )
      if (storageStateJSON) {
        return JSON.parse(storageStateJSON)
      }

      return inicialState
    },
  )

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }
    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycle-state-1.0.0', stateJSON)
  }, [cyclesState])
  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(MarCurrentCycleasFinishedAction())
  }

  function createNewCicle(data: CreateCycleData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(AddNewCycleAction(newCycle))
    setAmountSecondsPassed(0)
  }

  function interruptCurrentNewCicle() {
    dispatch(InterrupteCurrentCycleAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        createNewCicle,
        interruptCurrentNewCicle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
