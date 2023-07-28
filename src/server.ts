import fastify from 'fastify'
import { env } from './env'
import { mealRoutes } from './routes/meals'
import { userRoutes } from './routes/users'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie)
app.register(userRoutes, {
  prefix: 'users',
})
app.register(mealRoutes, {
  prefix: 'meals',
})

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
