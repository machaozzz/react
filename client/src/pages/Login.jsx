import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AuthContext from '../context/AuthContext'
import { apiUrl } from '../api'

// Floating Particles Background
function LoginParticles() {
  return (
    <div className="login-particles">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          className="login-particle"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 20,
            opacity: 0,
            scale: Math.random() * 0.5 + 0.3
          }}
          animate={{
            y: -100,
            opacity: [0, Math.random() * 0.6 + 0.2, 0],
            scale: [0.3, Math.random() * 0.8 + 0.5, 0.3],
            rotate: [0, 360]
          }}
          transition={{
            duration: Math.random() * 12 + 8,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            background: i % 3 === 0 ? 'var(--primary)' : 
                       i % 3 === 1 ? 'var(--accent)' : 'var(--success)',
            width: Math.random() * 6 + 2 + 'px',
            height: Math.random() * 6 + 2 + 'px',
            borderRadius: '50%',
            left: Math.random() * 100 + '%'
          }}
        />
      ))}
    </div>
  )
}

// Advanced Input Component
function ModernInput({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  icon, 
  required = false,
  onFocus,
  onBlur,
  autoComplete
}) {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const hasValue = value && value.length > 0
  const shouldFloat = focused || hasValue

  return (
    <div className="modern-input-wrapper">
      <div className={`modern-input-container ${error ? 'error' : ''} ${focused ? 'focused' : ''}`}>
        {icon && (
          <div className="input-icon">
            {icon}
          </div>
        )}
        
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setFocused(true)
            onFocus && onFocus()
          }}
          onBlur={() => {
            setFocused(false)
            onBlur && onBlur()
          }}
          className={`modern-input ${icon ? 'has-icon' : ''}`}
          autoComplete={autoComplete}
          placeholder=" "
        />
        
        <motion.label
          className={`modern-label ${shouldFloat ? 'floating' : ''} ${error ? 'error' : ''}`}
          animate={{
            y: shouldFloat ? -24 : 0,
            scale: shouldFloat ? 0.85 : 1,
            color: error ? 'var(--error)' : 
                   focused ? 'var(--primary)' : 'var(--text-muted)'
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {label} {required && <span className="required-star">*</span>}
        </motion.label>

        {type === 'password' && (
          <motion.button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? '🙈' : '👁️'}
          </motion.button>
        )}

        <div className="input-border">
          <motion.div 
            className="input-border-active"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: focused ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.div 
            className="input-error"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Loading Animation Component
function LoadingAnimation() {
  return (
    <div className="login-loading">
      <div className="loading-rings">
        <motion.div 
          className="ring ring-1"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div 
          className="ring ring-2"
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div 
          className="ring ring-3"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <motion.p
        className="loading-text"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        A autenticar...
      </motion.p>
    </div>
  )
}

// Success Animation
function SuccessAnimation() {
  return (
    <motion.div 
      className="login-success"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'backOut' }}
    >
      <motion.div 
        className="success-checkmark"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        ✅
      </motion.div>
      <h3>Login realizado com sucesso!</h3>
      <p>A redirecionar para o painel...</p>
    </motion.div>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  
  const { saveAuth, user } = useContext(AuthContext)
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin')
    }
  }, [user, navigate])

  const validateForm = () => {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido'
    }

    if (!password.trim()) {
      newErrors.password = 'Password é obrigatória'
    } else if (password.length < 6) {
      newErrors.password = 'Password deve ter pelo menos 6 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login falhou')
      }

      const data = await response.json()
      
      setSuccess(true)
      
      // Save auth with remember me option
      if (rememberMe) {
        localStorage.setItem('rememberUser', 'true')
      }
      
      saveAuth(data.token, data.user)
      
      // Delay navigation for success animation
      setTimeout(() => {
        navigate('/admin')
      }, 2000)

    } catch (error) {
      setErrors({ 
        general: error.message === 'Login falhou' ? 
          'Email ou password incorretos' : 
          error.message 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrors({ email: 'Introduza o seu email primeiro' })
      return
    }

    try {
      // Simulate forgot password request
      alert('📧 Instruções de recuperação enviadas para ' + email)
      setShowForgotPassword(false)
    } catch (error) {
      setErrors({ general: 'Erro ao enviar email de recuperação' })
    }
  }

  // Demo credentials helper
  const fillDemoCredentials = () => {
    setEmail('admin@stand.pt')
    setPassword('123456')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  if (success) {
    return (
      <div className="login-page success">
        <LoginParticles />
        <div className="login-container">
          <SuccessAnimation />
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <LoginParticles />
      
      <motion.div 
        className="login-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Login Header */}
        <motion.div className="login-header" variants={itemVariants}>
          <motion.div 
            className="login-logo"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ duration: 0.3 }}
          >
            <div className="logo-icon">🔐</div>
            <h1>Stand Login</h1>
          </motion.div>
          
          <motion.div className="login-subtitle" variants={itemVariants}>
            <p>Aceda ao seu painel de administração</p>
            <div className="login-badges">
              <span className="badge secure">🛡️ Seguro</span>
              <span className="badge encrypted">🔒 Encriptado</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Demo Credentials Helper */}
        <motion.div className="demo-helper" variants={itemVariants}>
          <div className="demo-content">
            <span className="demo-icon">💡</span>
            <span>Demo: </span>
            <button 
              type="button" 
              className="demo-btn"
              onClick={fillDemoCredentials}
            >
              Preencher credenciais
            </button>
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div className="login-form-container" variants={itemVariants}>
          <AnimatePresence>
            {errors.general && (
              <motion.div 
                className="general-error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <span className="error-icon">⚠️</span>
                <span>{errors.general}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-fields">
              <ModernInput
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                error={errors.email}
                icon="📧"
                required
                autoComplete="email"
                onBlur={() => {
                  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    setErrors(prev => ({ ...prev, email: 'Email inválido' }))
                  } else {
                    setErrors(prev => ({ ...prev, email: '' }))
                  }
                }}
              />

              <ModernInput
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                error={errors.password}
                icon="🔑"
                required
                autoComplete="current-password"
                onBlur={() => {
                  if (password && password.length < 6) {
                    setErrors(prev => ({ ...prev, password: 'Password deve ter pelo menos 6 caracteres' }))
                  } else {
                    setErrors(prev => ({ ...prev, password: '' }))
                  }
                }}
              />
            </div>

            {/* Form Options */}
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">Lembrar-me</span>
              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() => setShowForgotPassword(!showForgotPassword)}
              >
                Esqueceu a password?
              </button>
            </div>

            {/* Forgot Password Section */}
            <AnimatePresence>
              {showForgotPassword && (
                <motion.div
                  className="forgot-password-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="forgot-content">
                    <p>💡 Introduza o seu email para receber instruções de recuperação</p>
                    <div className="forgot-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowForgotPassword(false)}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleForgotPassword}
                      >
                        📧 Enviar
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="login-submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <LoadingAnimation />
              ) : (
                <div className="submit-content">
                  <span className="submit-icon">🚀</span>
                  <span className="submit-text">Entrar no Painel</span>
                  <span className="submit-arrow">→</span>
                </div>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer Links */}
        <motion.div className="login-footer" variants={itemVariants}>
          <div className="footer-links">
            <Link to="/" className="footer-link">
              🏠 Voltar ao início
            </Link>
            <Link to="/catalog" className="footer-link">
              🚗 Ver catálogo
            </Link>
            <Link to="/contact" className="footer-link">
              📞 Contactos
            </Link>
          </div>
          
          <div className="security-info">
            <div className="security-badge">
              <span className="security-icon">🛡️</span>
              <div className="security-text">
                <strong>Ligação Segura</strong>
                <small>Os seus dados estão protegidos</small>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}