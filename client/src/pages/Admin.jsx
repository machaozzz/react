import React, { useContext, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import AuthContext from '../context/AuthContext'
import { apiUrl } from '../api'

// Dashboard Stats Component
function DashboardStats({ vehicles = [] }) {
  const stats = [
    { label: 'Total Veículos', value: vehicles.length, icon: '🚗', color: 'primary' },
    { label: 'Disponíveis', value: vehicles.filter(v => v.status !== 'sold').length, icon: '✅', color: 'success' },
    { label: 'Vendidos', value: vehicles.filter(v => v.status === 'sold').length, icon: '💰', color: 'accent' },
    { label: 'Em Destaque', value: vehicles.filter(v => v.featured).length, icon: '⭐', color: 'warning' }
  ]

  return (
    <div className="dashboard-stats">
      {stats.map((stat, index) => (
        <motion.div 
          key={stat.label}
          className={`stat-card ${stat.color}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <div className="stat-value">
              <CountUpAnimation end={stat.value} />
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
          <div className="stat-glow"></div>
        </motion.div>
      ))}
    </div>
  )
}

// Count Up Animation
function CountUpAnimation({ end, duration = 2 }) {
  const [count, setCount] = useState(0)
  const ref = useRef()
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const increment = end / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, end, duration])

  return <span ref={ref}>{count}</span>
}

// Advanced Vehicle Form
function VehicleForm({ onSubmit, loading = false }) {
  const [form, setForm] = useState({ 
    title: '', description: '', price: '', year: '', fuel: '', 
    hp: '', seats: '', displacement: '', brand: '', model: '',
    color: '', doors: '', transmission: '', features: '',
    condition: 'usado', featured: false, status: 'available'
  })
  const [files, setFiles] = useState(null)
  const [fuels, setFuels] = useState([])
  const [newFuel, setNewFuel] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState({})

  const brands = [
    'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Toyota', 'Honda', 
    'Ford', 'Nissan', 'Hyundai', 'Kia', 'Peugeot', 'Renault', 'Citroën',
    'Fiat', 'Opel', 'Seat', 'Skoda', 'Mazda', 'Mitsubishi', 'Subaru'
  ]

  const conditions = [
    { value: 'novo', label: 'Novo', icon: '✨' },
    { value: 'usado', label: 'Usado', icon: '🚗' },
    { value: 'seminovo', label: 'Semi-novo', icon: '⭐' }
  ]

  const transmissions = [
    { value: 'manual', label: 'Manual', icon: '⚙️' },
    { value: 'automatica', label: 'Automática', icon: '🔄' },
    { value: 'semi-automatica', label: 'Semi-automática', icon: '⚡' }
  ]

  useEffect(() => {
    loadFuels()
  }, [])

  async function loadFuels() {
    try {
      const res = await fetch(apiUrl('/api/fuels'))
      const data = await res.json()
      setFuels(data || [])
    } catch (e) {
      console.error('Error loading fuels:', e)
    }
  }

  function validateForm() {
    const newErrors = {}
    if (!form.title.trim()) newErrors.title = 'Título é obrigatório'
    if (!form.price.trim()) newErrors.price = 'Preço é obrigatório'
    if (!form.year.trim()) newErrors.year = 'Ano é obrigatório'
    if (!form.brand.trim()) newErrors.brand = 'Marca é obrigatória'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateForm()) return
    
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (files) {
      for (const f of files) fd.append('images', f)
    }
    
    await onSubmit(fd)
    
    // Reset form on success
    setForm({
      title: '', description: '', price: '', year: '', fuel: '', 
      hp: '', seats: '', displacement: '', brand: '', model: '',
      color: '', doors: '', transmission: '', features: '',
      condition: 'usado', featured: false, status: 'available'
    })
    setFiles(null)
    setErrors({})
  }

  function handleDrag(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles && droppedFiles.length > 0) {
      setFiles(droppedFiles)
    }
  }

  return (
    <motion.div 
      className="vehicle-form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="form-header">
        <h2>✨ Adicionar Novo Veículo</h2>
        <p>Preencha todos os campos para criar um anúncio completo</p>
      </div>

      <form onSubmit={handleSubmit} className="modern-form">
        {/* Basic Info Section */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">📋</span>
            Informações Básicas
          </h3>
          
          <div className="form-grid">
            <div className="form-field">
              <label className={`form-label ${form.title ? 'focused' : ''} ${errors.title ? 'error' : ''}`}>
                Título do Anúncio <span className="required">*</span>
              </label>
              <input 
                className={`form-input ${errors.title ? 'error' : ''}`}
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})}
                placeholder=" "
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-field">
              <label className={`form-label ${form.price ? 'focused' : ''} ${errors.price ? 'error' : ''}`}>
                Preço (€) <span className="required">*</span>
              </label>
              <input 
                type="number"
                className={`form-input ${errors.price ? 'error' : ''}`}
                value={form.price} 
                onChange={e => setForm({...form, price: e.target.value})}
                placeholder=" "
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>

            <div className="form-field">
              <label className={`form-label ${form.brand ? 'focused' : ''} ${errors.brand ? 'error' : ''}`}>
                Marca <span className="required">*</span>
              </label>
              <select 
                className={`form-select ${errors.brand ? 'error' : ''}`}
                value={form.brand} 
                onChange={e => setForm({...form, brand: e.target.value})}
              >
                <option value="">Selecionar marca</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              {errors.brand && <span className="error-text">{errors.brand}</span>}
            </div>

            <div className="form-field">
              <label className={`form-label ${form.model ? 'focused' : ''}`}>
                Modelo
              </label>
              <input 
                className="form-input"
                value={form.model} 
                onChange={e => setForm({...form, model: e.target.value})}
                placeholder=" "
              />
            </div>

            <div className="form-field">
              <label className={`form-label ${form.year ? 'focused' : ''} ${errors.year ? 'error' : ''}`}>
                Ano <span className="required">*</span>
              </label>
              <input 
                type="number"
                className={`form-input ${errors.year ? 'error' : ''}`}
                value={form.year} 
                onChange={e => setForm({...form, year: e.target.value})}
                placeholder=" "
                min="1900"
                max={new Date().getFullYear() + 1}
              />
              {errors.year && <span className="error-text">{errors.year}</span>}
            </div>

            <div className="form-field">
              <label className={`form-label ${form.color ? 'focused' : ''}`}>
                Cor
              </label>
              <input 
                className="form-input"
                value={form.color} 
                onChange={e => setForm({...form, color: e.target.value})}
                placeholder=" "
              />
            </div>
          </div>
        </div>

        {/* Technical Specs Section */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">⚙️</span>
            Especificações Técnicas
          </h3>
          
          <div className="form-grid">
            <div className="form-field fuel-field">
              <label className={`form-label ${form.fuel ? 'focused' : ''}`}>
                Combustível
              </label>
              <div className="fuel-input-group">
                <select 
                  className="form-select"
                  value={form.fuel} 
                  onChange={e => setForm({...form, fuel: e.target.value})}
                >
                  <option value="">Selecionar combustível</option>
                  {fuels.map(f => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
                <input 
                  className="new-fuel-input"
                  placeholder="Novo combustível" 
                  value={newFuel} 
                  onChange={e => setNewFuel(e.target.value)}
                />
                <motion.button 
                  type="button" 
                  className="btn-add-fuel"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    if (!newFuel.trim()) return
                    try {
                      const res = await fetch(apiUrl('/api/fuels'), {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify({ name: newFuel.trim() })
                      })
                      if (res.ok) {
                        setNewFuel('')
                        loadFuels()
                        alert('Combustível adicionado!')
                      }
                    } catch (e) {
                      alert('Erro ao adicionar combustível')
                    }
                  }}
                >
                  ➕
                </motion.button>
              </div>
            </div>

            <div className="form-field">
              <label className={`form-label ${form.hp ? 'focused' : ''}`}>
                Potência (CV)
              </label>
              <input 
                type="number"
                className="form-input"
                value={form.hp} 
                onChange={e => setForm({...form, hp: e.target.value})}
                placeholder=" "
              />
            </div>

            <div className="form-field">
              <label className={`form-label ${form.displacement ? 'focused' : ''}`}>
                Cilindrada (cc)
              </label>
              <input 
                type="number"
                className="form-input"
                value={form.displacement} 
                onChange={e => setForm({...form, displacement: e.target.value})}
                placeholder=" "
              />
            </div>

            <div className="form-field">
              <label className={`form-label ${form.doors ? 'focused' : ''}`}>
                Portas
              </label>
              <select 
                className="form-select"
                value={form.doors} 
                onChange={e => setForm({...form, doors: e.target.value})}
              >
                <option value="">Selecionar</option>
                <option value="2">2 Portas</option>
                <option value="3">3 Portas</option>
                <option value="4">4 Portas</option>
                <option value="5">5 Portas</option>
              </select>
            </div>

            <div className="form-field">
              <label className={`form-label ${form.seats ? 'focused' : ''}`}>
                Lugares
              </label>
              <input 
                type="number"
                className="form-input"
                value={form.seats} 
                onChange={e => setForm({...form, seats: e.target.value})}
                placeholder=" "
                min="1"
                max="9"
              />
            </div>
          </div>

          {/* Transmission & Condition */}
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label focused">Transmissão</label>
              <div className="radio-group">
                {transmissions.map(trans => (
                  <label key={trans.value} className="radio-option">
                    <input 
                      type="radio"
                      name="transmission"
                      value={trans.value}
                      checked={form.transmission === trans.value}
                      onChange={e => setForm({...form, transmission: e.target.value})}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-icon">{trans.icon}</span>
                    <span className="radio-text">{trans.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-field">
              <label className="form-label focused">Estado</label>
              <div className="radio-group">
                {conditions.map(cond => (
                  <label key={cond.value} className="radio-option">
                    <input 
                      type="radio"
                      name="condition"
                      value={cond.value}
                      checked={form.condition === cond.value}
                      onChange={e => setForm({...form, condition: e.target.value})}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-icon">{cond.icon}</span>
                    <span className="radio-text">{cond.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description & Features */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">📝</span>
            Descrição e Características
          </h3>
          
          <div className="form-field">
            <label className={`form-label ${form.description ? 'focused' : ''}`}>
              Descrição Detalhada
            </label>
            <textarea 
              className="form-textarea"
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder=" "
              rows="5"
            />
          </div>

          <div className="form-field">
            <label className={`form-label ${form.features ? 'focused' : ''}`}>
              Características (separadas por vírgula)
            </label>
            <textarea 
              className="form-textarea"
              value={form.features} 
              onChange={e => setForm({...form, features: e.target.value})}
              placeholder="Ex: Ar condicionado, GPS, Bluetooth, Jantes em liga leve..."
              rows="3"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">📸</span>
            Imagens do Veículo
          </h3>
          
          <div 
            className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="upload-content">
              <div className="upload-icon">📁</div>
              <div className="upload-text">
                <p>Arraste as imagens aqui ou <span className="upload-link">clique para selecionar</span></p>
                <p className="upload-hint">Formatos: JPG, PNG, WEBP • Máximo: 10MB por imagem</p>
              </div>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={e => setFiles(e.target.files)}
                className="file-input"
              />
            </div>
            
            {files && files.length > 0 && (
              <div className="uploaded-files">
                <h4>📎 {files.length} ficheiro(s) selecionado(s)</h4>
                <div className="file-list">
                  {Array.from(files).map((file, i) => (
                    <div key={i} className="file-item">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">⚙️</span>
            Configurações
          </h3>
          
          <div className="checkbox-group">
            <label className="checkbox-option">
              <input 
                type="checkbox"
                checked={form.featured}
                onChange={e => setForm({...form, featured: e.target.checked})}
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">
                <strong>⭐ Destacar veículo</strong>
                <small>Aparecerá na página inicial</small>
              </span>
            </label>

            <div className="form-field">
              <label className="form-label focused">Status</label>
              <select 
                className="form-select"
                value={form.status} 
                onChange={e => setForm({...form, status: e.target.value})}
              >
                <option value="available">✅ Disponível</option>
                <option value="reserved">🔒 Reservado</option>
                <option value="sold">💰 Vendido</option>
                <option value="maintenance">🔧 Manutenção</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button 
          type="submit" 
          className="btn btn-primary btn-lg submit-button"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <div className="loading-content">
              <div className="spinner"></div>
              <span>Criando veículo...</span>
            </div>
          ) : (
            <>
              <span>✨ Criar Veículo</span>
              <span className="btn-arrow">→</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}

export default function Admin() {
  const { user, token, logout } = useContext(AuthContext)
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    if (token) loadVehicles()
  }, [token])

  async function loadVehicles() {
    try {
      const res = await fetch(apiUrl('/api/vehicles'))
      const data = await res.json()
      setVehicles(data || [])
    } catch (e) {
      setVehicles([])
    }
  }

  async function handleCreateVehicle(formData) {
    if (!token) {
      alert('Login necessário')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(apiUrl('/api/vehicles'), {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
        body: formData
      })
      
      if (res.ok) {
        alert('✅ Veículo criado com sucesso!')
        loadVehicles()
      } else {
        throw new Error('Erro ao criar veículo')
      }
    } catch (e) {
      alert('❌ Erro: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="access-denied">
        <motion.div 
          className="access-content"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="access-icon">🔒</div>
          <h2>Acesso Restrito</h2>
          <p>Precisa de fazer login para aceder ao painel admin.</p>
          <Link to="/login" className="btn btn-primary">
            🔐 Fazer Login
          </Link>
        </motion.div>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'add-vehicle', label: 'Adicionar Veículo', icon: '➕' },
    { id: 'manage-vehicles', label: 'Gerir Veículos', icon: '🚗' }
  ]

  return (
    <div className="admin-page">
      {/* Admin Header */}
      <motion.div 
        className="admin-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="admin-header-content">
          <div className="admin-welcome">
            <h1>👋 Bem-vindo, <span className="user-name">{user.name}</span></h1>
            <p className="user-role">🏷️ {user.role}</p>
          </div>
          
          <motion.button 
            onClick={logout} 
            className="btn btn-ghost logout-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚪 Logout
          </motion.button>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="admin-nav">
        <div className="nav-tabs">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="admin-content">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <DashboardStats vehicles={vehicles} />
              
              <div className="recent-activity">
                <h3>📈 Atividade Recente</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">✅</div>
                    <div className="activity-content">
                      <p>Sistema iniciado com sucesso</p>
                      <small>{new Date().toLocaleString('pt-PT')}</small>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'add-vehicle' && (
            <motion.div
              key="add-vehicle"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <VehicleForm onSubmit={handleCreateVehicle} loading={loading} />
            </motion.div>
          )}

          {activeTab === 'manage-vehicles' && (
            <motion.div
              key="manage-vehicles"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="vehicle-management">
                <h2>🚗 Gestão de Veículos</h2>
                <div className="vehicles-grid">
                  {vehicles.map(vehicle => (
                    <motion.div 
                      key={vehicle.id} 
                      className="vehicle-management-card"
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="vehicle-status-badge status-${vehicle.status || 'available'}">
                        {vehicle.status === 'available' ? '✅' : 
                         vehicle.status === 'sold' ? '💰' : 
                         vehicle.status === 'reserved' ? '🔒' : '🔧'}
                      </div>
                      <h4>{vehicle.title}</h4>
                      <p>💰 €{vehicle.price}</p>
                      <div className="vehicle-actions">
                        <button className="btn-icon edit">✏️</button>
                        <button className="btn-icon delete">🗑️</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}