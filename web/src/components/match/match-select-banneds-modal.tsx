'use client'
import { addToast, Button, CheckboxGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, NumberInput, useDisclosure } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import type { SetMatchBannedsMatchOutput } from '@/validation/set-match-banneds-form-schema'

import { setMatchBanneds } from '@/actions/match'
import { useMatch } from '@/contexts/match-context'
import { setMatchBannedsFormSchema } from '@/validation/set-match-banneds-form-schema'

import { CustomCheckbox } from '../custom-checkbox'

type SelectWinnerModalContentProps = {
  onClose: () => void

}

export function SelectBannedsModalContent({ onClose }: SelectWinnerModalContentProps) {
  const { match } = useMatch()
  const queryClient = useQueryClient()
  const [banneds, setBanneds] = useState<
    { id: string, amount?: number, error?: string[] }[]
  >(
    match?.banned.map(item => ({ id: item.userId, amount: item.count })) ?? [],
  )

  const handleSubmitMutation = useMutation({
    mutationFn: async (data: SetMatchBannedsMatchOutput) => {
      if (!match) {
        return
      }
      await setMatchBanneds(match.id, data.banneds)
    },
    onSuccess: () => {
      addToast({
        color: 'success',
        title: 'Banidos com sucesso',
      })
      queryClient.invalidateQueries({
        queryKey: ['retrieve-match'],
      })
      onClose()
    },
    onError: () => {
      addToast({
        color: 'danger',
        title: 'Erro ao selecionar o banidos',
      })
    },
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { error, data } = setMatchBannedsFormSchema.safeParse({ banneds })

    if (error) {
      const bannedErrors = error.formErrors.fieldErrors.banneds

      const mappedErrors = (bannedErrors ?? []).map((item, index) => {
        return { id: banneds[index].id, error: Array.isArray(item) ? item : [item] }
      })
      setBanneds((prev) => {
        return prev.map((banned) => {
          const error = mappedErrors.find(item => item.id === banned.id)
          if (error) {
            return { ...banned, error: Array.isArray(error.error) ? error.error : [error.error] }
          }
          return { ...banned, error: [] }
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
      <ModalHeader className="flex flex-col gap-1">Selecione os banidos da partida</ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody className="w-full">
          <CheckboxGroup
            value={banneds.map(item => item.id)}
            onValueChange={(selectedIds: string[]) => {
              setBanneds(prev =>
                selectedIds.map((id) => {
                  const already = prev.find(b => b.id === id)
                  return already ?? { id, amount: 0 }
                }),
              )
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              {match.participants.map(item =>
                (
                  <div key={item.id} className="h-full">
                    <CustomCheckbox
                      description={item.id}
                      value={item.id}
                      append={(
                        <AnimatePresence>
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="w-full overflow-hidden"
                          >
                            <NumberInput
                              value={banneds.find(b => b.id === item.id)?.amount}
                              minValue={0}
                              onValueChange={(amount) => {
                                setBanneds((prev) => {
                                  const already = prev.find(b => b.id === item.id)
                                  if (already) {
                                    return prev.map((b) => {
                                      if (b.id === item.id) {
                                        return { ...b, amount }
                                      }
                                      return b
                                    })
                                  }
                                  return [...prev, { id: item.id, amount }]
                                })
                              }}
                              isClearable
                              className="w-full"
                              classNames={{
                                inputWrapper: 'w-full border-0 rounded-t-none border-t',
                              }}
                              defaultValue={0}
                              label="Quantidade de cartas"
                              placeholder="Enter the amount"
                              variant="bordered"
                              onClear={() => setBanneds(prev => prev.filter(banned => banned.id !== item.id))}
                            />
                          </motion.div>
                        </AnimatePresence>
                      )}
                    >
                      {item.username}
                    </CustomCheckbox>

                    {
                      banneds.find(b => b.id === item.id)?.error?.length
                        ? (
                            <div className="text-red-500 text-sm mt-1">
                              {banneds.find(b => b.id === item.id)?.error?.map((error, index) => (
                                <p key={index}>{error}</p>
                              ))}
                            </div>
                          )
                        : null
                    }
                  </div>
                ),
              )}
            </div>
          </CheckboxGroup>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="danger" variant="light" onPress={onClose}>
            Voltar
          </Button>
          <Button type="submit" color="primary">
            Confirmar
          </Button>
        </ModalFooter>
      </form>
    </>
  )
}

export function SelectBannedsModal() {
  const openSetBansModal = useDisclosure()
  return (
    <>
      <Button onPress={openSetBansModal.onOpen} variant="ghost">
        Selecionar banidos
      </Button>
      <Modal size="2xl" isOpen={openSetBansModal.isOpen} onClose={openSetBansModal.onClose}>
        <ModalContent>
          {onClose => (
            <SelectBannedsModalContent onClose={onClose} />
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
