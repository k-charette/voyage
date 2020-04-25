const { ApolloServer, gql } = require("apollo-server-lambda")
const { sequelize, Listing } = require('../models')

const typeDefs = gql`
  type Query {
    listings: [Listing!]!
  }

  type Mutation {
    createListing(input: CreateListingInput!): Listing!
  }

  input CreateListingInput {
    title: String
    description: String
    url: String!
    notes: String
  }

  type Listing {
    id: ID!
    title: String
    description: String
    url: String!
    company: Company
    notes: String
    contact: [Contact!]!
  }

  type Company {
    id: ID!
    name: String!
    logo: String
    listings: [Listing!]!
    url: String
  }

  type Contact {
    id: ID!
    name: String!
    email: String
    notes: String
  }
`;

const resolvers = {
  Query: {
    listings(){
        return Listing.findAll()
    }
  },
  Mutation: {
    createListing(_, {input}) {
      return Listing.create(input)
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

exports.handler = server.createHandler();