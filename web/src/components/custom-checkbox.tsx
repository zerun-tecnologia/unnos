import type { Dispatch, ReactNode, SetStateAction } from 'react'

import { cn, NumberInput, useCheckbox, VisuallyHidden } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion'

type CustomCheckboxProps = {
  children: ReactNode
  description: string
  value: string
  append?: ReactNode
}

export function CustomCheckbox(props: CustomCheckboxProps) {
  const {
    Component,
    children,
    isSelected,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
  } = useCheckbox(props)

  return (
    <div className="flex flex-col justify-center border border-default rounded-lg overflow-hidden h-full">
      <Component
        {...getBaseProps()}
        className={cn(
          'group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent w-full',
          'cursor-pointer p-4 gap-4',
        )}
      >
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <span {...getWrapperProps()}>
          <span />
        </span>
        <div className="flex flex-col w-full">
          {children && <span {...getLabelProps()}>{children}</span>}
          {props.description && (
            <span className="text-small text-foreground opacity-70">
              <span className="text-gray-600">ID: </span>
              {props.description}
            </span>
          )}
        </div>
      </Component>
      {isSelected && props.append && props.append}
    </div>
  )
}
