import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { Heading, List, ListItem, Box } from '@chakra-ui/core'
import { Helmet}  from 'react-helmet'
import { graphql, useStaticQuery } from 'gatsby'

const Index = () => {
    const { site } = useStaticQuery(graphql`
        {
            site{
                siteMetadata{
                    title
                }
            }
        }
    `)

    const {data, loading, error} = useQuery(gql`
        {
            country(code: "JP"){
                name 
                capital
                languages{
                    name
                    native
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

    const { title } = site.siteMetadata
    const { name, capital, languages } = data.country
    return (
        <>
        <Helmet>
            <title>{title}</title>
        </Helmet>
            <Box as='header' px='6' py='2' bg='blue.200'>{title}</Box>
                <Box p='4'> 
                    <Heading mb='2'>{name}</Heading>
                    <p> Capital - {capital}</p>
                    <p>Languages: </p>
                    <List styleType='disc'>
                        {languages.map(language => (
                            <ListItem key={language.code}>{language.name}</ListItem>
                        ))}
                    </List>
                </Box>
        </>
    )
}

export default Index