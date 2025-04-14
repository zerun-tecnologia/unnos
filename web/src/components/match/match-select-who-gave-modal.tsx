'use client'
import { addToast, Button, CheckboxGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import type { SetMatchGavesMatchOutput } from '@/validation/set-match-gaves-form-schema'

import { setMatchGaves } from '@/actions/match'
import { useMatch } from '@/contexts/match-context'
import { setMatchGavesFormSchema } from '@/validation/set-match-gaves-form-schema'

import { CustomCheckbox } from '../custom-checkbox'

type SelectWinnerModalContentProps = {
  onClose: () => void

}

export function SelectWhoGaveContent({ onClose }: SelectWinnerModalContentProps) {
  const { match } = useMatch()
  const [gaves, setGaves] = useState<{ id: string, error: string[] }[]>(match?.gave.map(gave => ({ id: gave.id, error: [] })) ?? [])

  const queryClient = useQueryClient()

  const handleSubmitMutation = useMutation({
    mutationFn: async (data: SetMatchGavesMatchOutput) => {
      if (!match) {
        return
      }
      await setMatchGaves(match.id, data.gaves)
    },
    onSuccess: () => {
      addToast({
        color: 'success',
        title: 'Deram com sucesso',
      })
      queryClient.invalidateQueries({
        queryKey: ['retrieve-match'],
      })
      onClose()
    },
    onError: () => {
      addToast({
        color: 'danger',
        title: 'Erro ao selecionar dadas',
      })
    },
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { error, data } = setMatchGavesFormSchema.safeParse({ gaves })

    if (error) {
      const bannedErrors = error.formErrors.fieldErrors.gaves

      const mappedErrors = (bannedErrors ?? []).map((item, index) => {
        return { id: gaves[index].id, error: Array.isArray(item) ? item : [item] }
      })
      setGaves((prev) => {
        return prev.map((gaves) => {
          const error = mappedErrors.find(item => item.id === gaves.id)
          if (error) {
            return { ...gaves, error: Array.isArray(error.error) ? error.error : [error.error] }
          }
          return { ...gaves, error: [] }
        })
      })

      return
    }

    if (!match) {
      return
    }

    await handleSubmitMutation.mutateAsync(data)
  }

  if (!match) {
    return null
  }

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Selecione quem deu essa partida</ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody className="w-full">
          <CheckboxGroup
            onValueChange={(values: string[]) =>
              setGaves(values.map(value => ({ id: value, error: [] })))}
            value={gaves.map(gave => gave.id)}
          >
            <div className="grid grid-cols-2 gap-4">
              {match.participants.map(item => (
                <CustomCheckbox key={item.id} description={item.id} value={item.id}>
                  {item.username}
                </CustomCheckbox>
              ))}
            </div>
          </CheckboxGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose} type="button">
            Voltar
          </Button>
          <Button color="primary" type="submit">
            Confirmar
          </Button>
        </ModalFooter>
      </form>
    </>
  )
}

export function SelectWhoGaveModal() {
  const openSetBansModal = useDisclosure()
  return (
    <>
      <Button onPress={openSetBansModal.onOpen} variant="faded">
        Selecionar quem deu
      </Button>
      <Modal size="2xl" isOpen={openSetBansModal.isOpen} onClose={openSetBansModal.onClose}>
        <ModalContent>
          {onClose => (
            <SelectWhoGaveContent onClose={onClose} />
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
