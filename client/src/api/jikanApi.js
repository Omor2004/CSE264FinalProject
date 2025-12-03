const JIKAN_BASE_URL = 'https://api.jikan.moe/v4'
const MAX_RETRIES = 5

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchJikanData = async (endpoint, page = 1, signal = null, retries = 0) => {
  const separator = endpoint.includes('?') ? '&' : '?'
  const url = `${JIKAN_BASE_URL}/${endpoint}${separator}page=${page}`
  
  const delay = Math.pow(2, retries) * 1000
  
  if (retries > 0) {
    console.warn(`Jikan API Rate Limit or Error. Retrying in ${delay / 1000} seconds... (Attempt ${retries}/${MAX_RETRIES})`)
    await sleep(delay)
  }

  try {
    const response = await fetch(url, { signal })

    if (response.status === 429 && retries < MAX_RETRIES) {
      return fetchJikanData(endpoint, page, signal, retries + 1)
    }

    if (!response.ok) {
        if (signal?.aborted) {
            const abortError = new Error('Request aborted')
            abortError.name = 'AbortError'
            throw abortError
        }
        throw new Error(`Jikan API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    const resultData = data.data || []
    const hasNextPage = data.pagination?.has_next_page || false

    return { data: resultData, hasNextPage }

  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }
    
    if (retries < MAX_RETRIES) {
      return fetchJikanData(endpoint, page, signal, retries + 1)
    }
    
    console.error('Jikan Fetch Error:', error)
    return { data: [], hasNextPage: false }
  }
}