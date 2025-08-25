import React, { useState, useEffect, useContext } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Admin from './pages/Admin'
import { AuthProvider } from './context/AuthContext'
import AuthContext from './context/AuthContext'
import Footer from './components/Footer'
import Logo from './components/Logo'
import QuickContact from './components/QuickContact'
import './styles.css'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext)
  if (!token) return <Navigate to="/login" replace />
  return children
}

// Enhanced Navigation Component
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const mobileMenuVariants = {
    closed: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    open: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  const linkVariants = {
    initial: { y: 20, opacity: 0 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.4 }
    })
  }

  const navLinks = [
    { path: '/', label: 'Início', icon: '🏠' },
    { path: '/catalog', label: 'Catálogo', icon: '🚗' },
    { path: '/contact', label: 'Contactos', icon: '📞' },
    { path: '/login', label: 'Entrar', icon: '🔐' },
    { path: '/admin', label: 'Admin', icon: '⚙️' }
  ]

  return (
    <motion.nav 
      className={`nav ${isScrolled ? 'nav-scrolled' : ''}`}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-only">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.path}
              variants={linkVariants}
              initial="initial"
              animate="animate"
              custom={index}
            >
              <Link 
                to={link.path} 
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                <span className="nav-link-icon">{link.icon}</span>
                <span className="nav-link-text">{link.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="mobile-menu-btn mobile-only"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
            className="hamburger-line"
          />
          <motion.div
            animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
            className="hamburger-line"
          />
          <motion.div
            animate={{ rotate: isMobileMenuOpen ? -45 : 0 }}
            className="hamburger-line"
          />
        </motion.button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="mobile-menu-content">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  variants={linkVariants}
                  initial="initial"
                  animate="animate"
                  custom={index}
                >
                  <Link 
                    to={link.path} 
                    className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  >
                    <span className="mobile-nav-icon">{link.icon}</span>
                    <span className="mobile-nav-text">{link.label}</span>
                    <motion.div 
                      className="mobile-nav-arrow"
                      animate={{ x: location.pathname === link.path ? 10 : 0 }}
                    >
                      →
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// Page Transition Wrapper
function PageTransition({ children }) {
  const location = useLocation()

  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.98
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="page-container"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Loading Screen Component
function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 150)

    return () => clearInterval(timer)
  }, [])

  const loadingVariants = {
    hidden: { opacity: 1 },
    visible: { 
      opacity: 0,
      transition: { delay: 1.5, duration: 0.8 }
    }
  }

  return (
    <motion.div 
      className="loading-screen"
      variants={loadingVariants}
      initial="hidden"
      animate={progress >= 100 ? "visible" : "hidden"}
    >
      <div className="loading-content">
        <div className="loading-logo">
          <Logo />
        </div>
        <div className="loading-text">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Stand Automóvel
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Experiência Premium 2025
          </motion.p>
        </div>
        <div className="loading-progress">
          <div className="progress-bar">
            <motion.div 
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <motion.span 
            className="progress-text"
            key={Math.floor(progress)}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {Math.floor(progress)}%
          </motion.span>
        </div>
      </div>
      <div className="loading-particles">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 20,
              opacity: 0
            }}
            animate={{
              y: -20,
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
            style={{
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 2 + 's'
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// Main App Component
function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } />
              </Routes>
            </PageTransition>
          </main>
          <Footer />
          <QuickContact />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

// Render App
createRoot(document.getElementById('root')).render(<App />)