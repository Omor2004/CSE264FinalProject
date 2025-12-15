import { useState, useEffect, useCallback } from 'react'
import { UserAuth } from '../context/AuthContext'
import { fetchJikanData } from '../api/jikanApi'
import { supabase } from '../supabaseClient'

const CACHE_KEY = 'animeCatalogData'
const CACHE_TTL = 3600000 //1 hour in milliseconds

const USER_LIST_TABLE = 'users_anime_list' 
const MAX_PAGES_TO_FETCH = 5 //jikan api let us fetch data by pages, reason why we are setting 5 as a maximum to not lazy load the site

export const useAnimeData = () => {
  const { session, loading: authLoading } = UserAuth()
  const userId = session?.user?.id
  const isAuthenticated = !!userId

  const [publicAnime, setPublicAnime] = useState([])
  const [publicLoading, setPublicLoading] = useState(true)

  const [myList, setMyList] = useState({}) 
  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState(null)


  const fetchAllPublicAnime = useCallback(async () => {

    //checking cache first to avoid API call, when is valid and not expired
    const cachedData = localStorage.getItem(CACHE_KEY)
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData)
        if (Date.now() - timestamp < CACHE_TTL) {
          // Cache is valid: Use cached data and skip API call
          setPublicAnime(data)
          setPublicLoading(false)
          console.log("Loaded public anime catalog from cache.")
          return
        }
      } catch (e) {
        console.error("Error parsing cached anime data:", e)
        localStorage.removeItem(CACHE_KEY) // Clear bad cache
      }
    }

    //no valid cache, proceed to fetch
    setPublicLoading(true)
    let allAnime = []
    let page = 1
    let hasNextPage = true

    try {
      // Loop until we run out of pages OR hit the set limit
      while (hasNextPage && page <= MAX_PAGES_TO_FETCH) { 
        
        const result = await fetchJikanData('anime', page) 
        
        if (Array.isArray(result.data)) {
          allAnime = allAnime.concat(result.data)
        }
        
        hasNextPage = result.pagination?.has_next_page ?? false
        page++

        await new Promise(resolve => setTimeout(resolve, 1500)) 
      }

      const mappedData = allAnime
      .filter(item => item && item.mal_id)
      .map(item => ({
        jikan_id: item.mal_id,
        title: item.title,
        rating: item.score || 'N/A',
        picture: item.images?.webp?.image_url || item.images?.jpg?.image_url,
        description: item.synopsis ? item.synopsis.substring(0, 150) + '...' : 'No summary available.',
        type: item.type, 
      }))
  setPublicAnime(mappedData)

  //catching the newly fetched data
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ data: mappedData, timestamp: Date.now() })
)

    } catch (error) {
      console.error("Error fetching public anime:", error)
    } finally {
      setPublicLoading(false)
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      await fetchAllPublicAnime()
    }
    loadData()
    return () => {
    }
  }, [fetchAllPublicAnime])

  const toggleFavorite = async (jikanId, isFavorite) => {
    if (!isAuthenticated) return { success: false, error: "Authentication required." };
    
    const { error } = await supabase
        .from(USER_LIST_TABLE)
        .update({ is_favorite: isFavorite })
        .eq('anime_id', jikanId)
        .eq('user_id', userId);

    if (error) {
        console.error("Error toggling favorite: ", error);
        return { success: false, error: error.message };
    }
    return { success: true };
};


  const fetchMyList = useCallback(async () => {
    if (!userId) return

    setListLoading(true)
    setListError(null)

    // Supabase fetch logic
    const { data, error } = await supabase
      .from(USER_LIST_TABLE)
      .select('anime_id, status, episodes_watched, user_score, is_favorite')
      .eq('user_id', userId)

    if (error) {
      console.error("Supabase Fetch List Error:", error)
      setListError("Failed to load your list: " + error.message)
      setMyList({})
    } else {
      const newMyList = data.reduce((acc, item) => {
        acc[item.anime_id] = item
        return acc
      }, {})
      setMyList(newMyList)
      setListError(null)
    }

    setListLoading(false)
  }, [userId])

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      setMyList({})
      return
    }

    setListLoading(true)
    setListError(null)

    const channel = supabase.channel(`list_changes:${userId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: USER_LIST_TABLE,
          filter: `user_id=eq.${userId}` 
        },
        (payload) => {
          console.log('List change detected, re-fetching list:', payload)
        fetchMyList()
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          fetchMyList()
          // setListLoading(false)
        }
      })
    
    return () => {
      channel.unsubscribe()
      // setListLoading(false)
    }

  }, [isAuthenticated, userId, authLoading, fetchMyList]) 

  const addItemToList = async (item) => {
    if (!isAuthenticated) return { success: false, error: "Authentication required to add items." }
    
    const { error } = await supabase
      .from(USER_LIST_TABLE)
      .upsert({ 
        user_id: userId,
        anime_id: item.jikan_id,
        status: 'Watching',
        episodes_watched: 0,
        user_score: null,
        
        title: item.title,
        picture: item.picture,
        is_favorite: false,
      })

    if (error) {
      console.error("Error adding document: ", error)
      return { success: false, error: error.message }
    }
    return { success: true }
  }

  const removeItemFromList = async (jikanId) => {
    if (!isAuthenticated) return { success: false, error: "Authentication required to remove items." }
    const { error } = await supabase
      .from(USER_LIST_TABLE)
      .delete()
      .eq('anime_id', jikanId)
      .eq('user_id', userId) 

    if (error) {
      console.error("Error removing document: ", error)
      return { success: false, error: error.message }
    }
    return { success: true }
  }

  return {
    publicAnime,
    publicLoading,
    
    myList,
    listLoading: listLoading || authLoading, 
    listError,
    
    addItemToList,
    removeItemFromList,
    toggleFavorite,
    
    isItemInList: (jikanId) => !!myList[jikanId],
    isAuthenticated,
    userId,
  }
}