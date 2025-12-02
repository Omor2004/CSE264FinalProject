const JIKAN_BASE_URL = 'https://api.jikan.moe/v4'

export const fetchJikanData = async (endpoint) => {
  const url = `${JIKAN_BASE_URL}/${endpoint}`
  console.log(`Fetching Jikan data from: ${url}`)

  try {
    const response = await fetch(url)

    if (response.status === 429) {
      console.warn('Jikan API Rate Limit Exceeded. Retrying in 5 seconds...')
      await new Promise(resolve => setTimeout(resolve, 5000)) 
      return fetchJikanData(endpoint) // Retry the call
    }

    if (!response.ok) {
      throw new Error(`Jikan API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || [] 

  } catch (error) {
    console.error('Jikan Fetch Error:', error)
    return [] 
  }
}