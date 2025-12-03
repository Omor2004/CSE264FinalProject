import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'

import Layout from './components/Layout' 

import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import AnimeCatalog from './pages/AnimeCatalog'
import CurrentSeason from './pages/CurrentSeasonAnime'
import AnimeDetail from './pages/AnimeDetail'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ProfilePage from './pages/ProfilePage'
import MyListPage from './pages/MyListPage'
import NotFound from './pages/NotFound'


export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="anime-catalog" element={<AnimeCatalog />} />
        <Route path="current-season" element={<CurrentSeason />} />
        <Route path="anime/:jikanId/:slug" element={<AnimeDetail />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="list" element={<MyListPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* 404 Fallback for paths INSIDE the layout */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </>
  )
)
