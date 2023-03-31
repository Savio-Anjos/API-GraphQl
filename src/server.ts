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
    deleteUserByEmail(email: String!): User!
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
                        name: args.name,
                        email: args.email,
                        password: args.password
                    }
                })

                return user;
            },

            //Deletar usuário
            deleteUserByEmail: (_, args) => {
                const deletedUser = prismaClient.user.delete({
                    where: {
                        email: args.email
                    }
                })

                return deletedUser;
            }
        }
    }
})

server.listen().then(({ url }) => {
    console.log(`🚀 HTTP server running on ${url}`);
});