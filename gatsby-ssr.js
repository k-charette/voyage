import React from 'react'
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'isomorphic-fetch'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    fetch,
    uri: "/.netlify/functions/graphql",
  }),
  resolvers: {
    Query: {
      isLoggedIn() {
        const token = localStorage.getItem('voyage:token')
        return Boolean(token)
      },
    },
  },
});

export const wrapRootElement = ({ element }) => {
    return (
        <ApolloProvider client={client}>
            {element}
        </ApolloProvider>
    )
}
