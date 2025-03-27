'use client'
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Select, SelectItem } from '@heroui/react'
import { motion } from 'framer-motion'
import { useRouter_UNSTABLE as useRouter } from 'waku'

// Mock de dados para guildas
const MOCK_GUILDS = [
  { id: 'guild1', name: 'Heróis dos Jogos' },
  { id: 'guild2', name: 'Jogadores Profissionais' },
  { id: 'guild3', name: 'Esquadrão de Elite' },
  { id: 'guild4', name: 'Jogadores Casuais' },
]

export function CreateMatchForm() {
  const { push } = useRouter()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >

      <form onSubmit={() => {}}>
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
                onChange={() => {}}
              />
              <p className="text-xs text-muted-foreground">
                Se deixado em branco, um nome padrão será atribuído
              </p>
            </div>

            <div className="space-y-2">
              <Select label="Servidor">
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
              onPress={() => push('/matches')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-full px-8"
            >
              Criar Partida
            </Button>
          </CardFooter>
        </Card>
      </form>
    </motion.div>
  )
}
