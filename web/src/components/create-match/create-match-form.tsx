'use client'

import type { CreateMatchOutput } from '@/app/validation/create-match-form-schema'
import type { CreateMatchFormProps } from '@/reducers/match-reducer'
import type { FormEvent } from 'react'

import { listGuilds } from '@/actions/guilds'
import { createMatch } from '@/actions/match'
import { createMatchSchema } from '@/app/validation/create-match-form-schema'
import { formReducer } from '@/reducers/match-reducer'
import { matchNameGenerator } from '@/utils/match-name-generator'
import { addToast, Button, Card, CardBody, CardFooter, CardHeader, Input, Select, SelectItem } from '@heroui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useReducer } from 'react'

const initialFormState: CreateMatchFormProps = {
  name: {
    value: '',
    errors: [],
  },
  guildId: {
    value: '',
    errors: [],
  },

}

export function CreateMatchForm() {
  const { push } = useRouter()
  const [state, dispatch] = useReducer(formReducer, initialFormState)

  const { data: guilds, isFetching } = useQuery({
    queryKey: ['guilds'],
    queryFn: async () => await listGuilds(),

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
      participants: [],
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

      return
    }

    handleSubmitMutation.mutateAsync(data)
  }

  const guildsList = guilds || []
  const isLoading = isFetching || handleSubmitMutation?.isPending

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
                defaultValue={matchNameGenerator()}
                label="Nome da Partida (Opcional)"
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
