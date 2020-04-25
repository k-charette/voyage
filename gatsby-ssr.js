import React from 'react'
import { ApolloProvider, ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'isomorphic-fetch'

const httpLink = new HttpLink({
  fetch,
  uri: "/.netlify/functions/graphql",
})

const authLink = new ApolloLink((operation, forward) => {
  // get our token out of local storage and add it to authorization header and forward the operation to the next link in the chain
  const token = localStorage.getItem('voyage:token')
    if(token){
      operation.setContext({
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }

    return forward(operation)
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
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
