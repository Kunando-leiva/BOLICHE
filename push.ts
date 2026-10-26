import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as fs from 'fs'
import * as dotenv from 'dotenv'

dotenv.config()

// 1. IMPORTANTE: Usar DIRECT_URL para creación de tablas
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  const sql = fs.readFileSync('crear_tablas.sql', 'utf-8')
  console.log("Ejecutando SQL para crear tablas...")
  
  try {
    // 2. Pasamos TODO el archivo de una vez. PostgreSQL acepta múltiples comandos separados por ';'.
    await prisma.$executeRawUnsafe(sql)
    console.log("¡Tablas creadas exitosamente!")
  } catch (error) {
    console.error("Error al ejecutar el SQL:", error)
    throw error
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())