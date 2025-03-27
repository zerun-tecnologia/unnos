'use client'

import { addToast, Button, Card, CardBody, CardFooter, CardHeader, Input, Select, SelectItem } from '@heroui/react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useReducer } from 'react'

import type { CreateMatchOutput } from '@/app/validation/create-match-form-schema'

import { createMatchSchema } from '@/app/validation/create-match-form-schema'

type FormField<T> = {
  value: T
  errors: string[]
}

type CreateMatchFormProps = {
  fields: {
    name: FormField<CreateMatchOutput['name']>
    guildId: FormField<CreateMatchOutput['guildId']>
  }
  isSubmitting: boolean
}

const initialFormState: CreateMatchFormProps = {
  fields: {
    name: {
      value: '',
      errors: [],
    },
    guildId: {
      value: '',
      errors: [],
    },
  },
  isSubmitting: false,
}

type Actions = {
  type: 'SET_NAME'
  value: string
} | {
  type: 'SET_GUILD_ID'
  value: string
} | {
  type: 'SUBMIT_FORM'
  function: (state: CreateMatchOutput) => void
}

function formReducer(state: CreateMatchFormProps, action: Actions): CreateMatchFormProps {
  switch (action.type) {
    case 'SET_NAME': {
      return {
        ...state,
        fields: {
          ...state.fields,
          name: {
            value: action.value,
            errors: [],
          },
        },
      }
    }
    case 'SET_GUILD_ID': {
      return {
        ...state,
        fields: {
          ...state.fields,
          guildId: {
            value: action.value,
            errors: [],
          },
        },
      }
    }
    case 'SUBMIT_FORM': {
      const { error, data } = createMatchSchema.safeParse({
        name: state.fields.name.value,
        guildId: state.fields.guildId.value,
      })

      if (error && !data) {
        return {
          ...state,
          fields: {
            name: {
              value: state.fields.name.value,
              errors: error.errors
                .filter(e => e.path.includes('name'))
                .map(e => e.message),
            },
            guildId: {
              value: state.fields.guildId.value,
              errors: error.errors
                .filter(e => e.path.includes('guildId'))
                .map(e => e.message),
            },
          },
        }
      }

      state.isSubmitting = true
      try {
        action.function(data)
      }
      catch (err: unknown) {
        addToast({
          title: 'Erro ao criar partida',
        })
      }
      finally {
        state.isSubmitting = false
      }
      return state
    }
    default: {
      return state
    }
  }
}

const MOCK_GUILDS = [
  { id: '1', name: 'Servidor 1' },
]

export function CreateMatchForm({ handleSubmit }: { handleSubmit: (data: CreateMatchOutput) => void }) {
  const { push } = useRouter()
  const [state, dispatch] = useReducer(formReducer, initialFormState)

  useEffect(() => {
    console.log('Form state:', state)
  }, [state.fields])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >

      <form onSubmit={(e) => {
        e.preventDefault()
        dispatch({
          type: 'SUBMIT_FORM',
          function: (data) => {
            handleSubmit(data)
          },
        })
      }}
      >
        <Card className="glass-card animate-scale-in">
          <CardHeader className="flex flex-col items-start">
            <h1>Detalhes da Partida</h1>
            <div>
              Preencha as informações para criar sua nova partida
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="space-y-2">
              <Input
                label="Nome da Partida (Opcional)"
                id="match-name"
                placeholder="ex.: Torneio Semanal"
                errorMessage={state.fields.name.errors.join(', ')}
                isInvalid={state.fields.name.errors.length > 0}
                disabled={state.isSubmitting}
                onChange={(e) => {
                  dispatch({ type: 'SET_NAME', value: e.target.value })
                }}
              />
              <p className="text-xs text-muted-foreground">
                Se deixado em branco, um nome padrão será atribuído
              </p>
            </div>

            <div className="space-y-2">
              <Select
                label="Servidor"
                errorMessage={state.fields.guildId.errors.join(', ')}
                isInvalid={state.fields.guildId.errors.length > 0}
                disabled={state.isSubmitting}
                onChange={(e) => {
                  dispatch({ type: 'SET_GUILD_ID', value: e.target.value })
                }}
              >
                {MOCK_GUILDS.map(guild => (
                  <SelectItem key={guild.id}>
                    {guild.name}
                  </SelectItem>
                ))}
              </Select>
              <p className="text-xs text-muted-foreground">
                A Servidor à qual esta partida pertence
              </p>
            </div>
          </CardBody>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              disabled={state.isSubmitting}
              onPress={() => push('/matches')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-full px-8"
              isLoading={state.isSubmitting}
              isDisabled={state.isSubmitting}
            >
              Criar Partida
            </Button>
          </CardFooter>
        </Card>
      </form>
    </motion.div>
  )
}
