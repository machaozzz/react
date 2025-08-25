import React from 'react'
import { motion } from 'framer-motion'
import AnimatedBackground from '../components/AnimatedBackground'

const left = { hidden:{opacity:0,x:-20}, show:{opacity:1,x:0,transition:{duration:.6}} }
const right = { hidden:{opacity:0,x:20,scale:.98}, show:{opacity:1,x:0,scale:1,transition:{duration:.6}} }

export default function Home(){
  return (
    <main>
      <section className="hero split">
        <AnimatedBackground />
        <div className="hero-inner split-grid">
          <motion.div className="hero-left" initial="hidden" animate="show" variants={left}>
            <div className="panel">
              <h1>Stand Desportivo • Experiência Premium</h1>
              <p className="lead">Carros preparados e selecionados para quem procura desempenho e estilo. Financiamento e test-drives exclusivos.</p>
              <div className="cta-row">
                <a className="btn" href="/catalog">Explorar Catálogo</a>
                <a className="btn btn-outline" href="/contact">Contactos</a>
              </div>
              <div className="badges">
                <span className="badge">Garantia</span>
                <span className="badge">Inspeção 200p</span>
                <span className="badge">Assinatura VIP</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="hero-right" initial="hidden" animate="show" variants={right}>
            <div className="car-card">
              <img src="/demo/porsche.jpg" alt="porsche" />
              <div className="car-meta">
                <div>
                  <strong>Porsche 911 Carrera</strong>
                  <div className="muted">2021 • Gasolina • 385 cv</div>
                </div>
                <div className="price-tag">€125.000</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="stats">
        <div className="wrap">
          <motion.div className="stat" initial={{opacity:0,y:8}} animate={{opacity:1,y:0,transition:{delay:.08}}}>
            <div className="stat-num">{/* animated via CSS counter fallback */}520</div>
            <div className="stat-label">Viaturas selecionadas</div>
          </motion.div>
          <motion.div className="stat" initial={{opacity:0,y:8}} animate={{opacity:1,y:0,transition:{delay:.14}}}>
            <div className="stat-num">{24}</div>
            <div className="stat-label">Anos de experiência</div>
          </motion.div>
          <motion.div className="stat" initial={{opacity:0,y:8}} animate={{opacity:1,y:0,transition:{delay:.2}}}>
            <div className="stat-num">{98}%</div>
            <div className="stat-label">Satisfação</div>
          </motion.div>
        </div>
      </section>

      <section className="features">
        <article>
          <h3>Selecção Curada</h3>
          <p>Cada carro passa por uma vistoria rigorosa. Só o melhor entra no nosso stand.</p>
        </article>
        <article>
          <h3>Gestão Profissional</h3>
          <p>O dono gere permissões e contas com segurança encriptada.</p>
        </article>
        <article>
          <h3>Imersão Total</h3>
          <p>Páginas de veículo com todas as características técnicas e galerias de imagens.</p>
        </article>
      </section>
    </main>
  )
}
