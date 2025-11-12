import { Home as HomeIcon,
  Search as SearchIcon,
  Person as ProfileIcon,
  Star,
} from '@mui/icons-material'


import HomePage from   '../pages/HomePage'
import SearchPage from '../pages/SearchPage'
import MyListPage from '../pages/MyListPage'
import ProfilePage from '../pages/ProfilePage'

export const PUBLIC_NAVIGATION_LINKS = [
  {
    name: 'Anime',
    path: '/',
    icon: HomeIcon,
    component: HomePage,
  },
  {
    name: 'Search',
    path: '/search',
    icon: SearchIcon,
    component: SearchPage,
  },
]

export const AUTH_NAVIGATION_LINKS = [
  {
    name: 'Profile',
    path: '/profile',
    icon: ProfileIcon,
    component: ProfilePage,
  },
  {
    name: 'My List',
    path: '/list',
    icon: Star,
    component: MyListPage

  }
]

export const API_BASE_URL = 'https://api.anime.com/v1'

export const APP_NAME = 'AnimePulse'

//here we have to define our anime app name, because we dont have it yet, we will use a placeholder