import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'

import Layout from './components/Layout' 

import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import TopAnime from './pages/TopAnime'
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
        <Route path="top-anime" element={<TopAnime />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="list" element={<MyListPage />} />
        
        {/* 404 Fallback for paths INSIDE the layout */}
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </>
  )
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ColorModeProvider } from './context/ColorModeProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ColorModeProvider>
        <RouterProvider router={router} /> 
    </ColorModeProvider>
  </React.StrictMode>,
)