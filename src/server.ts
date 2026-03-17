import { env } from './env/index.ts'
import { app } from './app.ts'

app.listen({ port: env.PORT, host: env.HOST }).then(() => {
  console.log('Server is running on http://localhost:3333')
})
