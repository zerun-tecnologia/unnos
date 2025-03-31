'use client'
import { Button, CheckboxGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react'

import { useMatch } from '@/contexts/match-context'

import { CustomCheckbox } from '../custom-checkbox'

type SelectWinnerModalContentProps = {
  onClose: () => void

}

export function SelectBannedsModalContent({ onClose }: SelectWinnerModalContentProps) {
  const { match } = useMatch()

  if (!match) {
    return null
  }

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Selecione os banidos da partida</ModalHeader>
      <ModalBody className="w-full">
        <CheckboxGroup>
          <div className="grid grid-cols-2 gap-4">
            {match.participants.map(item => (

              <CustomCheckbox showNumberInput={true} key={item.id} description={item.id} value={item.id}>
                {item.username}
              </CustomCheckbox>

            ))}
          </div>
        </CheckboxGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
        <Button color="primary" onPress={onClose}>
          Action
        </Button>
      </ModalFooter>
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
