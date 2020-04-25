import React, { useState } from 'react'
import { useQuery, gql, useApolloClient, useMutation } from '@apollo/client'
import { Heading, Box, Text, Link, Input, Button, Flex, Stack, Textarea } from '@chakra-ui/core'
import { Helmet }  from 'react-helmet'
import { graphql, useStaticQuery } from 'gatsby'

const LOGGED_IN_QUERY = gql`
{
    isLoggedIn @client
}
`

const LISTING_FRAGMENT = gql`
    fragment ListingFragment on Listing {
        id
        url
        title
        description
        notes
    }
`
const CREATE_LISTING = gql`
    mutation CreateListing($input: CreateListingInput!){
        createListing(input: $input){
            ...ListingFragment
        }
    }
    ${LISTING_FRAGMENT}
`

const JOB_LISTINGS = gql`
    {
        listings {
            ...ListingFragment
        }
    }
    ${LISTING_FRAGMENT}
`

const JobListings = () => {
    const {data, loading, error, client} = useQuery(JOB_LISTINGS)
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
            {data.listings.map((listing) => (  
                <Box key={listing.id} p='4'> 
                    <Heading mb='2'>
                        <Link href={listing.url}>{listing.title || 'New Listing'}</Link>
                    </Heading>
                    {listing.description && <Text>{listing.description}</Text>}
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

const CreateJobListing = () => {
    const [createListing, {loading, error, data}] = useMutation(CREATE_LISTING)
    const handleSubmit = (event) => {
        event.preventDefault()

        const {title, description, url, notes} = event.target
        const input = {
            title: title.value,
            description: description.value,
            url: url.value,
            notes: notes.value,
        }

        createListing({
            variables: {input}, 
            update: (cache, { data }) => {
                const { listings } = cache.readQuery({query: JOB_LISTINGS })
                cache.writeQuery({
                    query: JOB_LISTINGS,
                    data: {
                        listings: [...listings, data.createListing],
                    },
                })
            }
        })
    }
    return (
        <Box maxW='480px' w='full' mt='8' mx='4'>
            <Heading mb='4' fontSize='md'>Create New Job Listing</Heading>
            <Stack as='form' onSubmit={handleSubmit}>
                <Input placeholder='Job Title' type='title' name='title'/>
                <Input placeholder='Job Description' type='description' name='description'/>
                <Input isRequired placeholder='Listing URL' type='url' name='url'/>
                <Textarea placeholder='Notes' name='notes'/>
                <Button mr='auto' mt='2' type='submit' isLoading={false}>Create Job Listing</Button>
            </Stack>
        </Box>
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
            <Flex as='header' justify='space-between' align='center' px='4' bg='blue.200' h='12'>
                <Heading fontSize='lg'> 
                    {title}
                </Heading>
                <Button onClick={() => {
                    localStorage.removeItem('voyage:token')
                    client.resetStore()
                    }}>Logout
                </Button>
            </Flex>
                <CreateJobListing />
                <JobListings /> 
            </>
            ) : (
                <LoginForm />
            )}
        </>
    )
}

export default Index