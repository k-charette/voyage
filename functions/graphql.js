 const { ApolloServer, gql } = require("apollo-server-lambda");

const typeDefs = gql`
  type Query {
    listings: [Listing!]!
  }

  type Listing {
      id: ID!
      title: String!
      description: String!
      url: String!
      company: Company!
      note: String
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
      note: String
  }
`;

const resolvers = {
  Query: {
    listings(){
        return [
            {
                id: 1,
                title: 'Software Developer',
                description: 'Looking for a developer to develop things',
                url: 'https://www.giveitago.com/jobs/software-developer',
                company: {
                    id: 1,
                    name: 'Give it a Go',
                    url: 'https://www.giveitago.com',
                    listing: [],
                },
                contact: []
            },
            {
                id: 2,
                title: 'Software Avocado',
                description: 'Looking for a developer to develop avocados',
                url: 'https://www.giveitago.com/jobs/avocado-developer',
                company: {
                    id: 1,
                    name: 'Give it a Go',
                    url: 'https://www.giveitago.com',
                    listing: [],
                },
                contact: []
            }
        ]
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

exports.handler = server.createHandler();