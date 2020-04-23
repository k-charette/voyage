module.exports = {
    siteMetadata: {
        title: 'Voyage'
    },
    plugins: [
        'gatsby-plugin-react-helmet',
        {
            resolve: 'gatsby-plugin-chakra-ui',
            options: {
                isUsingColorMode: false
            }   
        }
    ]
}