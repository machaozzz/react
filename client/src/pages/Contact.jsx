import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion'

// Advanced Form Hook
function useForm(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (fieldName, value) => {
    const rule = validationRules[fieldName]
    if (!rule) return ''
    
    if (rule.required && (!value || value.trim() === '')) {
      return rule.required
    }
    
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.pattern.message || 'Formato inválido'
    }
    
    if (rule.minLength && value.length < rule.minLength) {
      return `Mínimo ${rule.minLength} caracteres`
    }
    
    return ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    
    if (touched[name]) {
      const error = validate(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validate(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validateAll = () => {
    const newErrors = {}
    let hasErrors = false
    
    Object.keys(validationRules).forEach(field => {
      const error = validate(field, values[field])
      newErrors[field] = error
      if (error) hasErrors = true
    })
    
    setErrors(newErrors)
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    
    return !hasErrors
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    validateAll,
    reset: () => {
      setValues(initialValues)
      setErrors({})
      setTouched({})
      setIsSubmitting(false)
    }
  }
}

// Animated Contact Info Component
function ContactInfoCard({ icon, title, content, delay = 0, color = "primary" }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateX: -30
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        delay: delay + 0.3,
        type: "spring",
        stiffness: 200
      }
    }
  }

  // prepare address text and maps URL when this is the Morada card
  const addressText = Array.isArray(content) ? content.join(', ') : content
  const isAddress = title && title.toLowerCase().includes('morad')
  const mapsUrl = isAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}` : null

  return (
    <motion.div
      ref={ref}
      className="contact-info-card"
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.div 
        className={`contact-info-icon ${color}`}
        variants={iconVariants}
      >
        {icon}
      </motion.div>
      
      <div className="contact-info-content" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="contact-info-details" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {Array.isArray(content) ? content.map((item, index) => (
            <div key={index} className="contact-info-item">
              {item}
            </div>
          )) : content}
        </div>

        {/* se for a morada, mostra botão pequeno sem alterar layout geral */}
        {isAddress && mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 6,
              width: 'fit-content',
              padding: '6px 10px',
              fontSize: 13,
              textDecoration: 'none'
            }}
          >
            Ver no Maps
          </a>
        )}

        <h3 className="contact-info-title" style={{ marginTop: '8px' }}>{title}</h3>
      </div>

      <motion.div 
        className="contact-info-glow"
        animate={{
          opacity: [0, 0.5, 0],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}

// Advanced Form Input Component
function FormField({ 
  type = "text", 
  name, 
  label, 
  placeholder, 
  value, 
  error, 
  touched, 
  onChange, 
  onBlur,
  required = false,
  icon = null,
  rows = null
}) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = (e) => {
    setIsFocused(false)
    if (onBlur) onBlur(e)
  }

  const isTextarea = type === 'textarea'
  const InputComponent = isTextarea ? 'textarea' : 'input'
  const hasValue = value !== undefined && value !== null && value.toString().trim().length > 0
  const focused = isFocused || hasValue

  return (
    <motion.div 
      className={`form-field stacked ${focused ? 'focused' : ''} ${hasValue ? 'has-value' : ''} ${error && touched ? 'has-error' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* emoji/icon stacked above */}
      {icon && (
        <div className="form-icon-wrapper" aria-hidden="true">
          <div className="form-icon">{icon}</div>
        </div>
      )}

      <div className="form-input-area" style={{ width: '100%', position: 'relative' }}>
        <motion.label 
          className={`form-label ${error && touched ? 'error' : ''}`}
          animate={{ 
            color: error && touched ? '#ff3742' : focused ? 'var(--primary)' : 'var(--text-muted)'
          }}
          transition={{ duration: 0.16 }}
          onClick={() => inputRef.current?.focus()}
        >
          {label} {required && <span className="required-star">*</span>}
        </motion.label>

        <InputComponent
          ref={inputRef}
          type={!isTextarea ? type : undefined}
          name={name}
          placeholder={''}             /* placeholder removed to rely on floating label */
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={rows}
          className={`form-input ${error && touched ? 'error' : ''}`}
          autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'off'}
          aria-label={label}
        />
      </div>

      <AnimatePresence>
        {error && touched && (
          <motion.div
            className="form-error"
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="error-icon">⚠</span>
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Success Animation Component
function SuccessAnimation({ show, onComplete }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="success-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="success-content"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              duration: 0.6, 
              type: "spring", 
              stiffness: 200,
              damping: 15
            }}
            onAnimationComplete={onComplete}
          >
            <motion.div 
              className="success-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
            >
              ✓
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              Mensagem Enviada!
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              Obrigado pelo seu contacto. Responderemos em breve.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Interactive Map Component
function InteractiveMap() {
  const [isHovered, setIsHovered] = useState(false)
  const address = 'R. Moleiros 58, 4415-403 Seixezelo, Portugal' // já tem a localização correcta

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  return (
    <motion.div 
      className="interactive-map"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* animated background layer only - pointer-events none so it never blocks clicks */}
      <motion.div 
        className="map-overlay-bg"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: isHovered ? 0.3 : 0.8 }}
        transition={{ duration: 0.3 }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(0,0,0,0.35), transparent)' }}
      />

      {/* Info + button always visible and interactive */}
      <div 
        className="map-info" 
        style={{ position: 'relative', zIndex: 2, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
      >
        <div className="additional-icon map-icon" style={{ fontSize: 20, marginBottom: 10 }}>📍</div>
        <div className="map-text" style={{ maxWidth: 260 }}>
          <h4 style={{ margin: 0 }}>Automóveis Oliveira Santos</h4>
          <p style={{ margin: '8px 0 12px' }}>R. Moleiros 58<br/>4415-403 Seixezelo</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Ver no Maps
          </a>
        </div>
      </div>
      
      <div className="map-placeholder" style={{ position: 'relative', zIndex: 1 }}>
        {/* Map visualization (dots) */}
        <div className="map-grid">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="map-dot"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: Math.random() * 0.8 + 0.2, 
                opacity: Math.random() * 0.6 + 0.2 
              }}
              transition={{ 
                duration: 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Main Contact Component
export default function Contact() {
  const [showSuccess, setShowSuccess] = useState(false)
  const formRef = useRef(null)
  const isFormInView = useInView(formRef, { once: true, margin: "-50px" })
  
const form = useForm(
  {
    name: '',
    email: '',
    phone: '',
    subject: 'Informações Gerais',
    message: '',
    interest: '',
    budget: '',
    contactPreference: 'email'
  },
  {
    name: {
      required: 'Nome é obrigatório',
      minLength: 2,
      pattern: {
        test: (value) => /^[A-Za-zÀ-ÿ\u00f1\u00d1\s]+$/.test(value),
        message: 'Nome deve conter apenas letras'
      }
    },
    email: {
      required: 'Email é obrigatório',
      pattern: {
        test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Email deve conter @ e ser válido'
      }
    },
    phone: {
      pattern: {
        test: (value) => !value || /^[\d\s+()-]+$/.test(value),
        message: 'Telefone deve conter apenas números'
      }
    },
    interest: {
      pattern: {
        test: (value) => !value || /^[A-Za-z0-9À-ÿ\u00f1\u00d1\s\-,.]+$/.test(value),
        message: 'Formato inválido'
      }
    },
    budget: {
      pattern: {
        test: (value) => !value || /^[\d\s€.,\-]+$/.test(value),
        message: 'Orçamento deve conter apenas números e €'
      }
    },
    message: {
      required: 'Mensagem é obrigatória',
      minLength: 10
    }
  }
)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.validateAll()) {
      return
    }

    form.setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        form.reset()
      }, 3000)
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      form.setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: '📞',
      title: 'Telefone',
      content: ['+351 912 345 678', '+351 213 456 789'],
      color: 'primary'
    },
    {
      icon: '✉️',
      title: 'Email',
      content: ['info@standautomovel.pt', 'vendas@standautomovel.pt'],
      color: 'accent'
    },
    {
      icon: '📍',
      title: 'Morada',
      content: ['R. Moleiros 58', '4415-403 Seixezelo, Portugal'],
      color: 'success'
    },
    {
      icon: '🕒',
      title: 'Horário',
      content: ['Seg-Sex: 09:00 - 19:00', 'Sáb: 09:00 - 17:00', 'Dom: Fechado'],
      color: 'warning'
    }
  ]

  const subjectOptions = [
    'Informações Gerais',
    'Test Drive',
    'Financiamento',
    'Garantias',
    'Manutenção',
    'Peças',
    'Outro'
  ]

  return (
    <motion.main 
      className="contact-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <motion.div 
            className="contact-hero-content"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span 
              className="contact-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Contactos
            </motion.span>
            
            <motion.h1 
              className="contact-title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Estamos Aqui Para Si
            </motion.h1>
            
            <motion.p 
              className="contact-subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
                Fale connosco através do canal que preferir e descubra como podemos 
  ajudá-lo a encontrar o carro dos seus sonhos.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <ContactInfoCard
                key={info.title}
                icon={info.icon}
                title={info.title}
                content={info.content}
                delay={index * 0.15}
                color={info.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="contact-form-section">
        <div className="container">
          {/* force single column: mantemos só o formulário (remoção da coluna direita) */}
          <div className="contact-form-grid" style={{ gridTemplateColumns: '1fr', gap: 'var(--space-8)' }}>
            {/* Contact Form */}
            <motion.div
              ref={formRef}
              className="contact-form-container"
              style={{ display: 'flex', justifyContent: 'center' }}
              initial={{ opacity: 0, x: -60 }}
              animate={isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Inner wrapper limits width and centers form without changing global styles */}
              <div style={{ width: '100%', maxWidth: 760 }}>
                <div className="form-header">
                  <h2>Fale Connosco</h2>
                  <p>Preencha o formulário e entraremos em contacto consigo.</p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form" noValidate>
                  <div className="form-row">
                    <FormField
                      type="text"
                      name="name"
                      label="Nome Completo"
                      placeholder="Insira o seu nome"
                      value={form.values.name}
                      error={form.errors.name}
                      touched={form.touched.name}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      required
                      icon="👤"
                    />
                    
                    <FormField
                      type="email"
                      name="email"
                      label="Email"
                      placeholder="seu@email.com"
                      value={form.values.email}
                      error={form.errors.email}
                      touched={form.touched.email}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      required
                      icon="✉️"
                    />
                  </div>

                  <div className="form-row">
                    <FormField
                      type="tel"
                      name="phone"
                      label="Telefone"
                      placeholder="+351 9__ ___ ___"
                      value={form.values.phone}
                      error={form.errors.phone}
                      touched={form.touched.phone}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      icon="📞"
                    />

                    {/* --- substitua o bloco abaixo pelo seu snippet --- */}
                    <div className="form-field">
                      <label className="form-label">Assunto: {form.values.subject}</label>
                      <select
                        name="subject"
                        value={form.values.subject}
                        onChange={form.handleChange}
                        className="form-input form-select"
                      >
                        {subjectOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <FormField
                      type="text"
                      name="interest"
                      label="Interesse (Marca/Modelo)"
                      placeholder="Ex: BMW X5, Mercedes C-Class..."
                      value={form.values.interest}
                      error={form.errors.interest}
                      touched={form.touched.interest}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      icon="🚗"
                    />

                    <FormField
                      type="text"
                      name="budget"
                      label="Orçamento Aproximado"
                      placeholder="Ex: 20.000€ - 30.000€"
                      value={form.values.budget}
                      error={form.errors.budget}
                      touched={form.touched.budget}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      icon="💰"
                    />
                  </div>

                  <FormField
                    type="textarea"
                    name="message"
                    label="Mensagem"
                    placeholder="Descreva como podemos ajudá-lo..."
                    value={form.values.message}
                    error={form.errors.message}
                    touched={form.touched.message}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    required
                    rows={5}
                    icon="💬"
                  />

<div className="form-preferences">
  <label className="preference-label">Preferência de Contacto:</label>
  <div className="preference-options-modern">
    {[
      { value: 'email', icon: '✉️', label: 'Email', color: 'blue' },
      { value: 'phone', icon: '📞', label: 'Telefone', color: 'green' },
      { value: 'whatsapp', icon: '💬', label: 'WhatsApp', color: 'emerald' }
    ].map(pref => (
      <label key={pref.value} className={`preference-card ${form.values.contactPreference === pref.value ? 'active' : ''} ${pref.color}`}>
        <input
          type="radio"
          name="contactPreference"
          value={pref.value}
          checked={form.values.contactPreference === pref.value}
          onChange={form.handleChange}
          className="preference-radio"
        />
        <div className="preference-icon">{pref.icon}</div>
        <span className="preference-label-text">{pref.label}</span>
        <div className="preference-check">✓</div>
      </label>
    ))}
  </div>
</div>

                  <motion.button
                    type="submit"
                    className="btn btn-primary btn-lg form-submit"
                    disabled={form.isSubmitting}
                    /* removed motion hover/tap to prevent size changes on hover */
                    transition={{ duration: 0.2 }}
                  >
                    {form.isSubmitting ? (
                      <motion.div className="loading-content">
                        <motion.div 
                          className="spinner"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Enviando...
                      </motion.div>
                    ) : (
                      <>
                        <span>Enviar Mensagem</span>
                        <span className="btn-arrow">→</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* coluna direita removida (Visite-nos, mapa, test drives, financiamento, pós-venda) */}
          </div>
        </div>
      </section>

      <SuccessAnimation 
        show={showSuccess} 
        onComplete={() => setShowSuccess(false)} 
      />
    </motion.main>
  )
}