import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, useAnimation } from 'framer-motion'
import { Link } from 'react-router-dom'
import AnimatedBackground from '../components/AnimatedBackground'

// Advanced Counter Component with Intersection Observer
function AnimatedCounter({ end, duration = 2, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return

    const startTime = Date.now()
    const endTime = startTime + duration * 1000

    const updateCount = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / (endTime - startTime), 1)
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOutCubic * end))

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    updateCount()
  }, [isInView, end, duration])

  return (
    <span ref={ref} className="animated-counter">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

// Parallax Hero Section
function HeroSection() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const titleVariants = {
    hidden: { 
      opacity: 0,
      y: 100,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.2
      }
    }
  }

  const letterVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      rotateX: -90
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const words = ["Stand", "Desportivo", "•", "Experiência", "Premium"]

  return (
    <section className="hero">
      <AnimatedBackground />
      
      {/* Dynamic Background Gradient */}
      <motion.div 
        className="hero-gradient"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 102, 255, 0.15) 0%, transparent 50%)`
        }}
      />

      {/* Floating Elements */}
      <div className="hero-particles">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              x: [null, Math.random() * 200 - 100],
              scale: [0, Math.random() * 0.5 + 0.5, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: `linear-gradient(45deg, #0066ff, #ff4757)`
            }}
          />
        ))}
      </div>

      <motion.div 
        className="hero-content"
        style={{ opacity }}
      >
        <motion.div 
          className="hero-text"
          style={{ y: y1 }}
        >
          <motion.h1
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            {words.map((word, wordIndex) => (
              <motion.span key={wordIndex} className="word">
                {word.split('').map((char, charIndex) => (
                  <motion.span
                    key={`${wordIndex}-${charIndex}`}
                    variants={letterVariants}
                    className="char"
                  >
                    {char}
                  </motion.span>
                ))}
                {wordIndex < words.length - 1 && ' '}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            Carros preparados e selecionados para quem procura desempenho e estilo. 
            Financiamento e test-drives exclusivos com a mais avançada experiência digital.
          </motion.p>

          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.6, ease: "backOut" }}
          >
            <Link to="/catalog" className="btn btn-primary btn-lg">
              <motion.span
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Explorar Catálogo
              </motion.span>
              <motion.span 
                className="btn-icon"
                whileHover={{ x: 5, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                →
              </motion.span>
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-lg">
              <motion.span
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Contactos Premium
              </motion.span>
            </Link>
          </motion.div>

          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
          >
            <div className="stat-item">
              <div className="stat-number">
                <AnimatedCounter end={520} suffix="+" />
              </div>
              <div className="stat-label">Viaturas Selecionadas</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                <AnimatedCounter end={24} />
              </div>
              <div className="stat-label">Anos de Experiência</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                <AnimatedCounter end={98} suffix="%" />
              </div>
              <div className="stat-label">Satisfação Cliente</div>
            </div>
          </motion.div>

          <motion.div
            className="hero-badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.6 }}
          >
            {['Garantia Total', 'Inspeção 200 Pontos', 'Assinatura VIP', 'Test Drive'].map((badge, index) => (
              <motion.span 
                key={badge}
                className="hero-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 3 + index * 0.1, type: "spring", stiffness: 500 }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                {badge}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          style={{ y: y2 }}
          initial={{ opacity: 0, x: 100, rotateY: -30 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
        >
          <div className="featured-vehicle">
            <motion.div 
              className="vehicle-badge featured"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 2.5, type: "spring", stiffness: 300 }}
            >
              FEATURED
            </motion.div>
            
            <motion.img 
              src="/demo/porsche.jpg" 
              alt="Porsche 911 Carrera Featured"
              className="featured-vehicle-image"
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                rotateX: 2
              }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            
            <div className="featured-vehicle-content">
              <motion.div 
                className="vehicle-info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.5, duration: 0.6 }}
              >
                <h3 className="featured-vehicle-title">Porsche 911 Carrera</h3>
                <div className="featured-vehicle-specs">
                  <span>2021</span>
                  <span>•</span>
                  <span>Gasolina</span>
                  <span>•</span>
                  <span>385 CV</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="featured-vehicle-price"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 4, type: "spring", stiffness: 400 }}
              >
                €125.000
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4, duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="scroll-text">Scroll para descobrir</div>
        <div className="scroll-arrow">↓</div>
      </motion.div>
    </section>
  )
}

// Features Section with Advanced Animations
function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const features = [
    {
      icon: '🔍',
      title: 'Seleção Curada',
      description: 'Cada carro passa por uma inspeção rigorosa de 200 pontos. Só o melhor entra no nosso stand.',
      color: '#0066ff'
    },
    {
      icon: '⚡',
      title: 'Tecnologia Avançada',
      description: 'Sistema de gestão digital com realidade aumentada para uma experiência immersiva.',
      color: '#ff4757'
    },
    {
      icon: '🏆',
      title: 'Experiência Premium',
      description: 'Atendimento VIP, test-drives exclusivos e financiamento personalizado.',
      color: '#2ed573'
    }
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      scale: 0.8 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="section features-section" ref={ref}>
      <div className="section-header">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          variants={{
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.8 }
            }
          }}
        >
          Porque Somos Diferentes
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.8, delay: 0.2 }
            }
          }}
        >
          Redefinimos a experiência de comprar carros premium com tecnologia de ponta
        </motion.p>
      </div>

      <motion.div 
        className="features-grid"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {features.map((feature, index) => (
          <motion.article
            key={feature.title}
            className="feature-card"
            variants={itemVariants}
            whileHover={{ 
              y: -10, 
              scale: 1.02,
              boxShadow: "0 20px 80px rgba(0, 0, 0, 0.15)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="feature-icon"
              style={{ background: `linear-gradient(135deg, ${feature.color}, ${feature.color}cc)` }}
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {feature.icon}
            </motion.div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
            <motion.div 
              className="feature-line"
              style={{ background: feature.color }}
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            />
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}

// Main Home Component
export default function Home() {
  const { scrollYProgress } = useScroll()
  
  return (
    <motion.main
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Progress Bar */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
      />
      
      <HeroSection />
      <FeaturesSection />
    </motion.main>
  )
}