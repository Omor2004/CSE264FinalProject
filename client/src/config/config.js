import { Home as HomeIcon,
  Search as SearchIcon,
  Person as ProfileIcon,
  Star,
} from '@mui/icons-material'

export const PUBLIC_NAVIGATION_LINKS = [
  {
    name: 'Anime',
    path: '/',
    icon: HomeIcon
  },
  {
        name: 'Search',
        path: '/search',
        icon: SearchIcon,
    },
  {
    name: 'My List',
    path: '/list',
    icon: Star,
  },
]

export const AUTH_NAVIGATION_LINKS = [
  {
    name: 'Profile',
    path: '/profile',
    icon: ProfileIcon,
  },
  {
    name: 'My List',
    path: '/list',
    icon: Star,
  }
]

export const API_BASE_URL = 'https://api.anime.com/v1'

//here we have to define our anime app name, because we dont have it yet, we will use a placeholder