import { APIGatewayEvent, Context, Callback } from '@types/aws-lambda'
import NodeQL from 'nodeql'
import fetch from 'node-fetch'

interface Payload {
  data: {
    basketId: string
    total: number
  }
}

interface Basket {
  items: Array<{
    name: string
    price: number
  }>
}

export async function handler(event: APIGatewayEvent, lambdaContext: Context, callback: Callback) {
  const {data: {basketId, total}} = JSON.parse(event.body!) as Payload

  try {
    await validate(basketId, total)
  } catch (e) {
    callback(undefined, {
      statusCode: 200,
      body: JSON.stringify({error: e.message}),
    })
  }

  callback(undefined, {statusCode: 204})
}

async function validate(basketId: string, total: number): Promise<void> {
  // fetch needed information
  const client = new NodeQL(process.env.GRAPHQL_ENDPOINT)
  const {basket} = await client.query<{ basket: Basket }>(`{
    basket: Basket(id: "${basketId}") {
      items { name price }
    }
  }`)

  // check availability
  const availablity = await fetch('http://mockbin.org/bin/5aea0d1d-fcad-4cf8-8227-3d2ed3702362').then(r => r.json())

  for (const item of basket.items) {
    if (availablity[item.name] < 1) {
      throw new Error(`Item "${item.name}" out of stock`)
    }
  }

  // check total
  const actualTotal = basket.items.reduce((acc, i) => acc + i.price, 0)
  if (total !== actualTotal) {
    throw new Error(`Totals don't add up (provided: ${total}, actual: ${actualTotal}`)
  }
}
