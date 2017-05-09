import * as stripePkg from 'stripe'
import { APIGatewayEvent, Context, Callback } from '@types/aws-lambda'

const stripe = stripePkg(process.env.STRIPE_KEY)

interface Payload {
  data: {
    id: string
    total: number
    stripeToken: string
  }
}

export const handler = async (event: APIGatewayEvent, lambdaContext: Context, callback: Callback) => {
  const payload = JSON.parse(event.body!) as Payload
  const order = payload.data

  const charge = await stripe.charges.create({
    amount: order.total,
    currency: 'eur',
    description: `Order id: ${order.id}`,
    source: order.stripeToken,
  })

  console.log(`Charge (${charge.receipt_number}) succeeded`)

  callback(undefined, {statusCode: 204})
}
