import React, { useState } from 'react'
import { useQuery, gql, useApolloClient } from '@apollo/client'
import { Heading, Box, Text, Link, Input, Button } from '@chakra-ui/core'
import { Helmet }  from 'react-helmet'
import { graphql, useStaticQuery } from 'gatsby'

const LOGGED_IN_QUERY = gql`
{
    isLoggedIn @client
}
`

const JobListings = () => {
    const {data, loading, error, client} = useQuery(gql`
        {
            listings {
                id
                title
                description
                url
                company {
                    id
                    name
                    url
                }
            }
        }  
    `)

    if (loading) return <div> Loading now..</div>    
    if (error) {
        return(
            <>
                <div>Error: </div>
                <div> {error.message}</div>
            </>
        )    
    }

    return (
        <>
            {data.listings.map(listing => (  
                <Box key={listing.id} p='4'> 
                <Heading mb='2'>
                    <Link href={listing.url}>{listing.title}</Link>
                </Heading>
                <Text>
                    {
                        listing.company.url ? ( 
                            <Link href={listing.company.url}>{listing.company.name}</Link>
                        ) : (
                            listing.company.name
                        )
                    }
                </Text>
                <Text>{listing.description}</Text>
            </Box>
            ))}
        </>
    )
}

const LoginForm = () => {
    const client = useApolloClient()

    async function handleSubmit(event) {
        event.preventDefault()

        const response = await fetch('/.netlify/functions/auth', {
            headers: {
                Authorization: `Basic ${btoa(
                   `${event.target.email.value}:${event.target.password.value}`
                )}`,
            },
        })

        if (response.ok) {
           const token = await response.text()
           //store token in local storage
           localStorage.setItem('voyage:token', token)
           client.cache.writeQuery({
               query: LOGGED_IN_QUERY,
               data: { isLoggedIn: true}
           })
        }
   }

    return (
        <form onSubmit={handleSubmit}>
            <Input placeholder='Email' type='email' name='email'/>
            <Input placeholder='Password' type='password' name='password'/>
            <Button type='submit'>Login</Button>
        </form> 
    )
}

const Index = () => {
    const {data, loading, error, client } = useQuery(LOGGED_IN_QUERY)
    const { site } = useStaticQuery(graphql`
        {
            site{
                siteMetadata{
                    title
                }
            }
        }
    `)
  
    const { title } = site.siteMetadata
    const isLoggedIn = data && data.isLoggedIn
    return (
        <>
        <Helmet>
            <title>{title}</title>
        </Helmet>
            <Box as='header' px='6' py='2' bg='blue.200'>
                {title}
            </Box>
            {isLoggedIn ? (
            <>
            <Button onClick={() => {
                localStorage.removeItem('voyage:token')
                client.writeQuery({
                    query: LOGGED_IN_QUERY,
                    data: { isLoggedIn: false }
                })
                }}>Logout
                </Button>
                <JobListings /> 
            </>
            ) : (
                <LoginForm />
            )}
        </>
    )
}

export default Index