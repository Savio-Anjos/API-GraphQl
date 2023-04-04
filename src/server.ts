import { ApolloServer, gql } from "apollo-server";
import { randomUUID } from "node:crypto";
import prismaClient from "./prisma";

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
    address: String!
  }

  type Query {
    # Listar usuários
    users: [User!]!
  }
  type Mutation {
    # Cadastrar usuário
    createUser(
      name: String!
      email: String!
      password: String!
      address: String!
    ): User!

    # Atualizar usuário
    updateUser(
      id: ID!
      name: String!
      email: String!
      password: String!
      address: String!
    ): User!

    # Deletar usuário
    deleteUser(id: ID!): Boolean
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      users: () => {
        return prismaClient.user.findMany();
      },
    },

    Mutation: {
      //Criar usuário
      createUser: (_, args) => {
        const user = prismaClient.user.create({
          data: {
            id: randomUUID(),
            name: args.name,
            email: args.email,
            password: args.password,
            address: args.address,
          },
        });

        return user;
      },

      //Deletar usuário
      deleteUser: async (_, args) => {
        const deletedUser = await prismaClient.user.delete({
          where: {
            id: args.id,
          },
        });

        return !!deletedUser;
      },

      //Atualizar usuário
      updateUser: (_, args) => {
        const updatedUser = prismaClient.user.update({
          where: { id: args.id },
          data: {
            name: args.name,
            email: args.email,
            password: args.password,
            address: args.address,
          },
        });

        return updatedUser;
      },
    },
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 HTTP server running on ${url}`);
});
