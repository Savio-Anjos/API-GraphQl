import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    hello: String

  }
  type Mutation {
    createUser(name: String!, email: String!, password: String)!
  }
  `

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query: {
            hello: () => "Hello World"
        },

        Mutation: {
           createUser: (args) => {}
        }
    }

})

server.listen().then(({ url }) => {
    console.log(`🚀 Server running on ${url}`)
})