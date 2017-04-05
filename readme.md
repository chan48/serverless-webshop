This is the code repository for the Serverless Webshop example used in various presentations and tutorials:

[AWS Serverless Webday](https://aws.amazon.com/de/campaigns/serverless-webday1/)

[serverless.com blog](https://serverless.com/blog/2017-04-5-build-webshop-with-graphql-and-serverless/)

To use this example, create an account for each of these services and fill in the configuration data:

 * graph.cool
 * Stripe
 * Mailgun

## Data Model

```graphql
type Basket {
  createdAt: DateTime!
  id: ID!
  isDelivered: Boolean!
  isPaid: Boolean!
  items: [Item!]! @relation(name: "BasketOnItem")
  stripeToken: String
  updatedAt: DateTime!
  user: User @relation(name: "BasketOnUser")
}

type Item {
  baskets: [Basket!]! @relation(name: "BasketOnItem")
  createdAt: DateTime!
  id: ID!
  name: String!
  price: Int!
  updatedAt: DateTime!
}

type User {
  baskets: [Basket!]! @relation(name: "BasketOnUser")
  createdAt: DateTime!
  email: String
  id: ID!
  name: String!
  updatedAt: DateTime!
}
```


Below is listed all GraphQL queries used throughout the presentation:

## Create User

```graphql
mutation {
  createUser(email:"user@gmail.com", name:"Carl Johan"){
    id
  }
}
```

## Create Item
```graphql
mutation {
  createItem(name: "Mackbook Pro 2016", price: 250000){
    id
  }
}
```

## Create Basket

```graphql
mutation {
  createBasket(userId:"cj11yp6q0fb5c0145fnviqho3", itemsIds:["cj11yrk2zzp1n0197dnhu3zif"]){
    id
  }
}
```

## Set stripeToken for basket

```graphql
mutation {
  updateBasket(id:"cj11ytlwgje2u0112jfl30zoe", stripeToken:"tok_1A2d3hAM0MAtIPOj2f5HS7th"){
    id
  }
}
```

## Subscription

```graphql
subscription{
  Basket(filter:{mutation_in:UPDATED, updatedFields_contains:"isPaid"}){
    node{
      items{
        id
        name
        price
      }
      user{
        name
        email
      }
    }
  }
}
```

## Mutation Callback for Stripe

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
