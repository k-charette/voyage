import React, { useState } from 'react'
import { useQuery, gql, useApolloClient } from '@apollo/client'
import { Heading, Box, Text, Link, Input, Button, Flex, Stack } from '@chakra-ui/core'
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
    // grabbing the client
    const client = useApolloClient()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function handleSubmit(event) {
        event.preventDefault()

        setLoading(true)
    // making a request to authenticate
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
           client.resetStore()
        } else {
            //TODO: set display error
            const error = await response.text()
            setError(new Error(error))
            setLoading(false) 
        }
   }

    return (
        <Flex align='center' justify='center' h='100vh' bg='gray.50'>
            <Stack as='form' p='8' rounded='lg' shadow='lg' maxW='320px' w='full' bg='white' spacing='4' onSubmit={handleSubmit}>
            <Heading textAlign='center' fontSize='lg' pb='2'>Voyage</Heading>
                {error && <Text color='red.500'>{error.message}</Text>}
                <Input placeholder='Email' type='email' name='email'/>
                <Input placeholder='Password' type='password' name='password'/>
                <Button ml='auto' mt='2' isLoading={loading} type='submit'>Login</Button>
            </Stack> 
        </Flex>
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
           
            {isLoggedIn ? (
        <>
            <Box as='header' px='6' py='2' bg='blue.200'>
                {title}
            </Box>
            <Button onClick={() => {
                localStorage.removeItem('voyage:token')
                client.resetStore()
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