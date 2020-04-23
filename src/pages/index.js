import React from 'react'
import { useQuery, gql } from '@apollo/client';

const Index = () => {
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

    const { name, capital, languages } = data.country
    return (
        <div> 
            <h1> {name}</h1>
            <p> Capital - {capital}</p>
            <p>Languages: </p>
            <ul>
                {languages.map(language => (
                    <li key={language.code}>{language.name}</li>
                ))}
            </ul>
        </div>
    )
}

export default Index