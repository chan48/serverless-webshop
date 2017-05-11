import * as stripePkg from 'stripe'
import { APIGatewayEvent, Context, Callback } from '@types/aws-lambda'

const stripe = stripePkg(process.env.STRIPE_KEY)

interface Order {
  id: string
  total: number
  stripeToken: string
}

interface Payload {
  data: Order
}

export const handler = async (event: APIGatewayEvent, lambdaContext: Context, callback: Callback) => {
  const payload = JSON.parse(event.body!) as Payload

  try {
    await charge(payload.data)
  } catch (e) {
    callback(undefined, {
      statusCode: 200,
      body: JSON.stringify({error: e.message}),
    })
  }

  callback(undefined, {statusCode: 204})
}

async function charge(order: Order): Promise<void> {
  const charge = await stripe.charges.create({
    amount: order.total,
    currency: 'eur',
    description: `Order id: ${order.id}`,
    source: order.stripeToken,
  })

  console.log(`Charge (${charge.receipt_number}) succeeded`)
}
