import type { ReactNode } from 'react'

import { cn, NumberInput, useCheckbox, VisuallyHidden } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion'

type CustomCheckboxProps = {
  children: ReactNode
  description: string
  value: string
  showNumberInput?: boolean
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
    <div className="flex flex-col justify-center border border-default rounded-lg overflow-hidden">
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
      <AnimatePresence>
        {isSelected && props.showNumberInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full overflow-hidden"
          >
            <NumberInput
              isClearable
              className="w-full"
              classNames={{
                inputWrapper: 'w-full border-0 rounded-t-none border-t',
              }}
              defaultValue={10}
              label="Quantidade de cartas"
              placeholder="Enter the amount"
              variant="bordered"
              onClear={() => console.log('number input cleared')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
