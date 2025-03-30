'use client'
import { Button, CheckboxGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, RadioGroup, useDisclosure } from '@heroui/react'

import type { MatchDetail } from '@/actions/match'

import { useMatch } from '@/contexts/match-context'

import { CustomCheckbox } from '../custom-checkbox'
import { CustomRadio } from '../custom-radio'

type SelectWinnerModalContentProps = {
  onClose: () => void

}

export function SelectWhoGaveContent({ onClose }: SelectWinnerModalContentProps) {
  const { match } = useMatch()

  if (!match) {
    return null
  }

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
      <ModalBody className="w-full">
        <CheckboxGroup>
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
