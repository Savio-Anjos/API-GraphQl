import { ApolloServer, gql } from 'apollo-server';
import { randomUUID } from 'node:crypto';
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
    id: ID!
    name: String!
    email: String!
    password: String!
  }
  type Query {
    users: [User!]!
  }
 type Mutation {
    # Cadastrar usuário
    createUser(name: String!, email: String!, password: String!): User!

    # Deletar usuário
    deleteUser(id: ID!): Boolean
 }
`

interface User {
    id: string
    name: string
    email: string
    password: string
}


const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query: {
            users: () => {
                return prismaClient.user.findMany()
            }
        },

        Mutation: {

            //Criar usuário
            createUser: (_, args) => {
                const user = prismaClient.user.create({
                    data: {
                        id: randomUUID(),
                        name: args.name,
                        email: args.email,
                        password: args.password
                    }
                })

                return user;
            },

            //Deletar usuário
            deleteUser: async (_, args) => {
                const deletedUser = await prismaClient.user.delete({
                    where: {
                        id: args.id
                    }
                })

                return !!deletedUser;
            }
        }
    }
})

server.listen().then(({ url }) => {
    console.log(`🚀 HTTP server running on ${url}`);
});