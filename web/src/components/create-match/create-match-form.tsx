'use client'

import type { FormEvent } from 'react'

import { addToast, Button, Card, CardBody, CardFooter, CardHeader, CheckboxGroup, Input, Select, SelectItem, Switch } from '@heroui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useReducer } from 'react'

import type { CreateMatchFormProps } from '@/reducers/match-reducer'
import type { CreateMatchOutput } from '@/validation/create-match-form-schema'

import { listGuilds } from '@/actions/guilds'
import { createMatch } from '@/actions/match'
import { fetchUsersUnpaged } from '@/actions/users'
import { formReducer } from '@/reducers/match-reducer'
import { matchNameGenerator } from '@/utils/match-name-generator'
import { createMatchSchema } from '@/validation/create-match-form-schema'

import { CustomCheckbox } from '../custom-checkbox'

const initialFormState: CreateMatchFormProps = {
  name: {
    value: matchNameGenerator(),
    errors: [],
  },
  guildId: {
    value: '',
    errors: [],
  },
  participants: {
    value: [],
    errors: [],
  },
  selectPaticipants: false,
}

export function CreateMatchForm() {
  const { push } = useRouter()
  const [state, dispatch] = useReducer(formReducer, initialFormState)

  const { data: guilds, isFetching: isFetchingGuilds } = useQuery({
    queryKey: ['guilds'],
    queryFn: async () => await listGuilds(),
  })

  const { data: users, isFetching: isFetchingUsers } = useQuery({
    queryKey: ['users', state.guildId.value],
    queryFn: async () => await fetchUsersUnpaged({
      filters: {
        guilds: [state.guildId.value],
      },
    }),
    enabled: !!state.guildId.value,
  })

  const handleSubmitMutation = useMutation({
    mutationFn: async (data: CreateMatchOutput) => {
      createMatch(data)
    },
    onSuccess: () => {
      push('/matches')
      addToast({
        color: 'success',
        title: 'Partida criada com sucesso',
      })
    },
    onError: () => {
      addToast({
        color: 'danger',
        title: 'Erro ao criar a partida',
      })
    },
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { error, data } = createMatchSchema.safeParse({
      name: state.name.value,
      guildId: state.guildId.value,
      participants: state.participants.value,
    })

    if (error) {
      error.formErrors.fieldErrors.guildId && dispatch({
        type: 'SET_GUILD_ID',
        field: { errors: error.formErrors.fieldErrors.guildId },
      })

      error.formErrors.fieldErrors.name && dispatch({
        type: 'SET_NAME',
        field: { errors: error.formErrors.fieldErrors.name },
      })

      error.formErrors.fieldErrors.participants && dispatch({
        type: 'SET_PARTICIPANTS',
        field: { errors: error.formErrors.fieldErrors.participants },
      })

      return
    }

    handleSubmitMutation.mutateAsync(data)
  }

  const guildsList = guilds || []
  const usersList = useMemo(() => users || [], [users])
  const isLoading = isFetchingGuilds || isFetchingUsers || handleSubmitMutation?.isPending

  useEffect(() => {
    if (state.selectPaticipants && usersList.length > 0) {
      dispatch({
        type: 'SET_PARTICIPANTS',
        field: { value: usersList.map(user => user.id) },
      })
    }
  }, [usersList, state.selectPaticipants])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >

      <form onSubmit={handleSubmit}>
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
                value={state.name.value}
                id="match-name"
                placeholder="ex.: Torneio Semanal"
                errorMessage={state.name.errors.join(', ')}
                isInvalid={state.name.errors.length > 0}
                disabled={isLoading}
                onChange={(e) => {
                  dispatch({ type: 'SET_NAME', field: { value: e.target.value } })
                }}
              />
              <p className="text-xs text-muted-foreground">
                Se deixado em branco, um nome padrão será atribuído
              </p>
            </div>

            <div className="space-y-2">
              <Select
                label="Servidor"
                errorMessage={state.guildId.errors.join(', ')}
                isInvalid={state.guildId.errors.length > 0}
                disabled={isLoading}
                onChange={(e) => {
                  dispatch({ type: 'SET_GUILD_ID', field: { value: e.target.value } })
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

            <div className="space-y-4">
              <div className="flex gap-2">
                <Switch id="select-participants" onChange={() => dispatch({ type: 'TOGGLE_SELECT_PARTICIPANTS' })} />
                <label
                  htmlFor="select-participants"
                  className="flex flex-col cursor-pointer"
                >
                  Selecionar participantes?
                  <span className="text-xs text-muted-foreground">
                    Se não for marcado, todos os usuários do servidor serão
                    marcados como participantes desta partida
                  </span>
                </label>
                {state.participants.errors.length > 0 && (
                  <p className="text-xs text-destructive-foreground">
                    {state.participants.errors.join(', ')}
                  </p>
                )}
              </div>
              {state.selectPaticipants && state.guildId && (
                <CheckboxGroup
                  onChange={e =>
                    dispatch({
                      type: 'SET_PARTICIPANTS',
                      field: {
                        value: e,
                      },
                    })}
                  value={state.participants.value.map(item => item)}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <AnimatePresence>
                      {usersList.map((user, index) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                          <CustomCheckbox
                            description={user.id}
                            value={user.id}
                          >
                            {user.username}
                          </CustomCheckbox>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CheckboxGroup>
              )}
            </div>
          </CardBody>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              isDisabled={isLoading}
              onPress={() => push('/matches')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-full px-8"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              Criar Partida
            </Button>
          </CardFooter>
        </Card>
      </form>
    </motion.div>
  )
}
