import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['error', 'warn'],
})

let isConnected = false
let reconnectAttempts = 0
const maxReconnectAttempts = 5
const reconnectDelay = 5000 // 5 segundos

export async function connectToDatabase(): Promise<boolean> {
  try {
    await prisma.$connect()
    isConnected = true
    reconnectAttempts = 0
    console.log('✅ Conectado ao banco de dados')
    return true
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error)
    isConnected = false
    return false
  }
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    if (!isConnected) {
      isConnected = true
      console.log('✅ Conexão com banco de dados restaurada')
    }
    return true
  } catch (error) {
    console.error('❌ Conexão com banco perdida:', error)
    isConnected = false
    await attemptReconnect()
    return false
  }
}

async function attemptReconnect(): Promise<void> {
  if (reconnectAttempts >= maxReconnectAttempts) {
    console.error(`❌ Máximo de tentativas de reconexão atingido (${maxReconnectAttempts})`)
    return
  }

  reconnectAttempts++
  console.log(`🔄 Tentando reconectar ao banco... (tentativa ${reconnectAttempts}/${maxReconnectAttempts})`)
  
  setTimeout(async () => {
    const connected = await connectToDatabase()
    if (!connected && reconnectAttempts < maxReconnectAttempts) {
      await attemptReconnect()
    }
  }, reconnectDelay)
}

export function getDatabaseStatus(): { connected: boolean; attempts: number } {
  return {
    connected: isConnected,
    attempts: reconnectAttempts
  }
}

// Verificação periódica da conexão (a cada 30 segundos)
setInterval(async () => {
  if (isConnected) {
    await checkDatabaseConnection()
  }
}, 30000)

// Conectar inicialmente
await connectToDatabase().catch((e) => {
  console.error('❌ Falha na conexão inicial com o banco:', e)
  process.exit(1)
})
