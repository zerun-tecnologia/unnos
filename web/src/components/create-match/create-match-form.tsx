'use client'

import { Button, Card, CardBody, CardFooter, CardHeader, Input, Select, SelectItem } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useReducer } from 'react'

import type { CreateMatchOutput } from '@/app/validation/create-match-form-schema'

import { listGuilds } from '@/actions/guilds'
import { createMatchSchema } from '@/app/validation/create-match-form-schema'
import { matchNameGenerator } from '@/utils/match-name-generator'

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

      return {
        ...state,
        isSubmitting: true,
      }
    }
    default: {
      return state
    }
  }
}

export function CreateMatchForm() {
  const { push } = useRouter()
  const [state, dispatch] = useReducer(formReducer, initialFormState)

  const { data: guilds, isFetching } = useQuery({
    queryKey: ['guilds'],
    queryFn: async () => await listGuilds(),

  })

  const isLoading = isFetching || state.isSubmitting

  const guildsList = guilds || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >

      <form>
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
                defaultValue={matchNameGenerator()}
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
                {guildsList.map(guild => (
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
              isDisabled={state.isSubmitting}
              isLoading={state.isSubmitting}
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
