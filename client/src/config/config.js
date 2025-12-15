import { Person as ProfileIcon, Star } from '@mui/icons-material'

import AllAnime from '../pages/AnimeCatalog'
import ProfilePage from '../pages/ProfilePage'

export const PUBLIC_NAVIGATION_LINKS = [
  {
    name: 'Current Season',
    path: '/current-season', 
    apiEndpoint: 'seasons/now',
    icon: Star,
  },
  {
    name: 'Anime Catalog',
    path: '/anime-catalog', 
    apiEndpoint: 'top/anime',
    component: AllAnime,
  }
]

export const AUTH_NAVIGATION_LINKS = [
  {
    name: 'Profile',
    path: '/profile',
    icon: ProfileIcon,
    component: ProfilePage,
  }
]

export const API_BASE_URL = 'https://api.anime.com/v1'

export const APP_NAME = 'AnimePulse'

//here we have to define our anime app name, because we dont have it yet, we will use a placeholder