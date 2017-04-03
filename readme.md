This is the code repository for the Serverless Webshop example used in various presentations as well as the tutorial on https://serverless.com/blog/

To use this example, create an account for each of these services and fill in the configuration data:

 * graph.cool
 * Stripe
 * Mailgun

A complete tutorial is available at https://serverless.com/blog/

Below is listed all GraphQL queries used throughout the presentation:

## Mutation Callback for Stripe

[![Greenkeeper badge](https://badges.greenkeeper.io/graphcool-examples/serverless-webshop.svg)](https://greenkeeper.io/)

https://4gix95vh56.execute-api.eu-west-1.amazonaws.com/dev/serverless-webshop/stripeTokenAddedToBasketCallback

```graphql
{
  updatedNode{
    id
    isPaid
    items{
      price
      name
    }
    stripeToken
    user{
      name
      email
    }
  }
}
```

## Mutation Callback for Mailgun

```graphql
{
  updatedNode{
    id
    isDelivered
    user{
      name
      email
    }
    items{
      name
    }
  }
}
```


## Subscription

```
subscription{
  Basket(filter:{mutation_in:UPDATED, updatedFields_contains:"isPaid"}){
    node{
      items{
        id
        name
        itemsInStock
      }
    }
  }
}
```