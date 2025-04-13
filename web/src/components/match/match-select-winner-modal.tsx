'use client'
import type { FormEvent } from 'react'

import { addToast, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, RadioGroup, useDisclosure } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useReducer } from 'react'

import type { SetMatchWinnerMatchOutput } from '@/validation/set-match-winner-form-schema'
import type { SetWinnerFormProps } from '@/reducers/set-winner-reducer'

import { setMatchWinner } from '@/actions/match'
import { setMatchWinnerFormSchema } from '@/validation/set-match-winner-form-schema'
import { useMatch } from '@/contexts/match-context'
import { formReducer } from '@/reducers/set-winner-reducer'

import { CustomRadio } from '../custom-radio'

const initialState: SetWinnerFormProps = {
  winnerId: {
    value: '',
    errors: [],
  },
}

export function SelectWinnerModal() {
  const { match, isLoading } = useMatch()

  const openSetWinnerModal = useDisclosure()
  const [state, dispatch] = useReducer(formReducer, initialState)
  const queryClient = useQueryClient()

  const handleSubmitMutation = useMutation({
    mutationFn: async (data: SetMatchWinnerMatchOutput) => {
      if (!match) {
        return
      }
      await setMatchWinner(match.id, data)
    },
    onSuccess: () => {
      addToast({
        color: 'success',
        title: 'Vencedor selecionado com sucesso',
      })
      queryClient.invalidateQueries({
        queryKey: ['retrieve-match'],
      })
      openSetWinnerModal.onClose()
    },
    onError: () => {
      addToast({
        color: 'danger',
        title: 'Erro ao selecionar o vencedor',
      })
    },
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { error, data } = setMatchWinnerFormSchema.safeParse({
      winnerId: state.winnerId.value,
    })

    if (error) {
      error.formErrors.fieldErrors.winnerId && dispatch({
        type: 'SET_WINNER_ID',
        field: { errors: error.formErrors.fieldErrors.winnerId },
      })

      return
    }

    handleSubmitMutation.mutateAsync(data)
  }

  if (!match) {
    return null
  }

  return (
    <>
      <Button onPress={openSetWinnerModal.onOpenChange} disabled={isLoading} isLoading={handleSubmitMutation.isPending}>
        Selecionar Vencedor
      </Button>
      <Modal size="2xl" isOpen={openSetWinnerModal.isOpen} onOpenChange={openSetWinnerModal.onOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <form onSubmit={handleSubmit}>
                <ModalBody className="w-full">
                  <RadioGroup
                    isDisabled={handleSubmitMutation.isPending}
                    onChange={(e) => {
                      dispatch({ type: 'SET_WINNER_ID', field: { value: e.target.value } })
                    }}
                    value={state.winnerId.value}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {match.participants.map(item => (
                        <CustomRadio key={item.id} description={item.id} value={item.id}>
                          {item.username}
                        </CustomRadio>
                      ))}
                      <p>{state.winnerId.errors.length > 0 && state.winnerId.errors.join(', ')}</p>
                    </div>
                  </RadioGroup>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    type="button"
                    onPress={onClose}
                    isDisabled={handleSubmitMutation.isPending}
                  >
                    Voltar
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isDisabled={handleSubmitMutation.isPending}
                    isLoading={handleSubmitMutation.isPending}
                  >
                    Salvar
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
