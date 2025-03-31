import type { ReactNode } from 'react'

import { cn, useRadio, VisuallyHidden } from '@heroui/react'

type CustomRadioProps = {
  children: ReactNode
  description: string
  value: string
}

export function CustomRadio(props: CustomRadioProps) {
  const {
    Component,
    children,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props)

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        'group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent',
        'cursor-pointer border-2 border-default rounded-lg gap-4 p-4',
        'data-[selected=true]:border-primary',
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">
            <span className="text-gray-600">ID: </span>
            {description}
          </span>
        )}
      </div>
    </Component>
  )
}
