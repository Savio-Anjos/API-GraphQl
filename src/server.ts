import { ApolloServer, gql } from 'apollo-server';
import prismaClient from './prisma';

/*
 * Under fetching
 * Rota HTTP que retorna dados de menos
 * 
 * Over fetching
 * Rota HTTP que retorna mais dados do que precisamos
*/

const typeDefs = gql`
  type User {
    name: String!
    email: String!
    password: String!
  }
  type Query {
    users: [User!]!
  }
 type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
 }
`

interface User {
    name: string
    email: string
    password: string
}

const users: User[] = [];

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query: {
            users: () => {
                return users
            }
        },

        Mutation: {
            createUser: (_, args) => {
                const user = prismaClient.user.create({
                    data: {
                        name: args.name,
                        email: args.email,
                        password: args.password
                    }
                })

                return user;
            }
        }
    }
})

server.listen().then(({ url }) => {
    console.log(`🚀 HTTP server running on ${url}`);
});