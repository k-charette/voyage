import React from 'react'
import { useQuery, gql } from '@apollo/client';

export default function Index() {
    const {data, loading, error} = useQuery(gql`
        {
            country(code: "JP"){
            name 
            }
        }
    `)

    if (loading) return <div> Loading now..</div>
    
    if (error) {
        return(
            <div>{error.message}</div>
        )    
    }

    return (
        <div> {JSON.stringify(data)} </div>
    )
}