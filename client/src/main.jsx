import React from 'react'
function ProtectedRoute({ children }){
  // simple guard that reads localStorage token
  const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!t) return <Navigate to="/login" />
  return children
}
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Admin from './pages/Admin'
import { AuthProvider } from './context/AuthContext'
import AuthContext from './context/AuthContext'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import Footer from './components/Footer'
import Logo from './components/Logo'
import QuickContact from './components/QuickContact'
import './styles.css'

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav className="nav">
          <Link to="/" className="logo"><Logo /></Link>
          <div>
            <Link to="/catalog">Catálogo</Link>
            <Link to="/contact">Contactos</Link>
            <Link to="/login">Entrar</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/catalog" element={<Catalog/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/admin" element={<ProtectedRoute><Admin/></ProtectedRoute>} />
        </Routes>
    <Footer />
    <QuickContact />
      </BrowserRouter>
    </AuthProvider>
  )
}

createRoot(document.getElementById('root')).render(<App />)
