import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Contact(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null) // 'sending' | 'success' | 'error'

  function validate(){
    const e = {}
    if (!name.trim()) e.name = 'Por favor indica o teu nome'
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Email inválido'
    if (!message.trim() || message.trim().length < 10) e.message = 'Mensagem muito curta'
    return e
  }

  async function handleSubmit(ev){
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    setStatus('sending')
    // simulate send delay
    try{
      await new Promise(r=>setTimeout(r,900))
      setStatus('success')
      setName(''); setEmail(''); setPhone(''); setMessage('')
      setTimeout(()=>setStatus(null), 3000)
    }catch(err){
      setStatus('error')
      setTimeout(()=>setStatus(null), 3000)
    }
  }

  return (
    <section className="contact">
      <div className="contact-grid">
        <motion.div className="contact-card" initial={{opacity:0, y:6}} animate={{opacity:1, y:0}}>
          <h3>Contactos</h3>
          <p>Telefone: <strong>912 345 678</strong></p>
          <p>Email: <strong>info@stand.pt</strong></p>
          <div style={{marginTop:10}}>
            <span className="badge">Atendimento: Seg-Sex 9:00 - 19:00</span>
          </div>
        </motion.div>

        <motion.div className="contact-card" initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{delay:0.08}}>
          <h3>Visita o Stand</h3>
          <div className="map-placeholder">Mapa (demo)</div>
        </motion.div>
      </div>

      <motion.form className="contact-form" onSubmit={handleSubmit} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.14}} noValidate>
        <div className="form-row">
          <label className="field">
            <div className="label-text">Nome</div>
            <input aria-label="Nome" placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </label>
          <label className="field">
            <div className="label-text">Email</div>
            <input aria-label="Email" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </label>
        </div>

        <div className="form-row">
          <label className="field full">
            <div className="label-text">Telefone (opcional)</div>
            <input aria-label="Telefone" placeholder="Telefone (opcional)" value={phone} onChange={e=>setPhone(e.target.value)} />
          </label>
        </div>

        <label className="field">
          <div className="label-text">Mensagem</div>
          <textarea aria-label="Mensagem" placeholder="Mensagem" rows={5} value={message} onChange={e=>setMessage(e.target.value)} />
          {errors.message && <div className="field-error">{errors.message}</div>}
        </label>

        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <button className="btn" type="submit" disabled={status==='sending'}>{status==='sending' ? 'A Enviar...' : 'Enviar Mensagem'}</button>
          {status === 'success' && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="send-ok">Mensagem enviada ✓</motion.div>}
          {status === 'error' && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="send-err">Erro a enviar</motion.div>}
        </div>
      </motion.form>
    </section>
  )
}
