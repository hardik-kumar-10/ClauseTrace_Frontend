import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import WarRoomPage from '@/pages/WarRoomPage'
import PostMortemPage from '@/pages/PostMortemPage'
import HistoryPage from '@/pages/HistoryPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                              element={<LandingPage />} />
        <Route path="/incident/:id"                  element={<WarRoomPage />} />
        <Route path="/incident/:id/postmortem"       element={<PostMortemPage />} />
        <Route path="/history"                       element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  )
}
