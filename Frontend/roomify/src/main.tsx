
import { createRoot } from 'react-dom/client'
import './index.css'
import Welcome from './Pages/Welcome.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NewChat from './Pages/NewChat.tsx'
import Chatroom from './Pages/Chatroom.tsx'

createRoot(document.getElementById('root')!).render(
<BrowserRouter>
<Routes>
  <Route path='/' element={<Welcome/>}/>
  <Route path='/newchat' element={<NewChat/>}/>
  <Route path='/room/:roomId' element={<Chatroom/>}/>
</Routes>
</BrowserRouter>
)
