import { ApolloServer, gql } from "apollo-server";
import prismaClient from "./prisma";

const users: string[] = [];

const typeDefs = gql`
  type Query {
    hello: String

  }

  type User {
    email: String!
    name: String!
    password: String!
  }

  type Query {
    users: [User!]!
  }


  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
  }
  `

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query: {
            hello: () => "Hello World"
        },

        Mutation: {
           createUser: (args) => {
            prismaClient.createUser(args.name, args.email, args.password)

            return 

           }
        }
    }

})

server.listen().then(({ url }) => {
    console.log(`🚀 Server running on ${url}`)
})