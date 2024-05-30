import { HandPalm, Play } from 'phosphor-react'
import { HomeContainer, StartCownDownButton, StopCownDownButton } from './style'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/CountDown'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useContext } from 'react'
import { CyclesContext } from '../../contexts/CyclesContext'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'Informar acima de 5 minutos')
    .max(60, 'Informar até 60 minutos'),
})

// extrai a interface direto do zod.
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const { activeCycle, createNewCicle, interruptCurrentNewCicle } =
    useContext(CyclesContext)
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  const task = watch('task')
  const isSubmitDisabled = !task

  function handleCreateNewCicle(data: NewCycleFormData) {
    createNewCicle(data)
    reset()
  }
  /*
   * Prop Drilling -> qunado a gente tem MUITAS propriedades APENAS para comunicacao entre componentes
   * Context API -> permite compartilharmos informacoes entre 'VÁRIOS componentes ao mesmo tempo
   */

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCicle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCownDownButton onClick={interruptCurrentNewCicle} type="button">
            <HandPalm size={24} /> Interromper
          </StopCownDownButton>
        ) : (
          <StartCownDownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} /> Começar
          </StartCownDownButton>
        )}
      </form>
    </HomeContainer>
  )
}
