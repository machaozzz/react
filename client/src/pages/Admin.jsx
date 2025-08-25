import React, { useContext, useState, useEffect } from 'react'
import AuthContext from '../context/AuthContext'
import { apiUrl } from '../api'

export default function Admin(){
  const { user, token, logout } = useContext(AuthContext)
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({ title:'', description:'', price:'', year:'', fuel:'', hp:'', seats:'', displacement:'' })
  const [files, setFiles] = useState(null)
  const [fuels, setFuels] = useState([])
  const [newFuel, setNewFuel] = useState('')

  useEffect(()=>{ load(); }, [])

  async function load(){
    try{ const res = await fetch(apiUrl('/api/vehicles')); const d = await res.json(); setVehicles(d); }catch(e){ setVehicles([]) }
  }

  useEffect(()=>{ async function lf(){ try{ const r = await fetch(apiUrl('/api/fuels')); const dd = await r.json(); setFuels(dd || []);}catch(e){ console.error('fuels', e) } } lf(); }, [])

  async function submit(e){
    e.preventDefault();
    if (!token) return alert('Login necessário');
    const fd = new FormData();
    Object.entries(form).forEach(([k,v])=>fd.append(k,v))
    if (files) for (const f of files) fd.append('images', f)
    const res = await fetch(apiUrl('/api/vehicles'), { method:'POST', headers: { Authorization: 'Bearer '+token }, body: fd })
    if (res.ok){ alert('Veículo criado'); setForm({ title:'', description:'', price:'', year:'', fuel:'', hp:'', seats:'', displacement:'' }); setFiles(null); load(); }
    else { alert('Erro'); }
  }

  if (!user) return <div style={{padding:20}}>Acesso restrito. Faz <a href="/login">login</a>.</div>

  return (
    <section style={{padding:20}}>
      <h2>Painel Admin — {user.name} ({user.role})</h2>
      <button onClick={logout} style={{marginBottom:10}}>Logout</button>

      <form onSubmit={submit} style={{display:'grid',gap:8,maxWidth:720}}>
        <input placeholder="Título" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <textarea placeholder="Descrição" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
        <input placeholder="Preço" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
        <input placeholder="Ano" value={form.year} onChange={e=>setForm({...form,year:e.target.value})} />
        <div style={{display:'flex',gap:8}}>
          <select value={form.fuel} onChange={e=>setForm({...form,fuel:e.target.value})}>
            <option value="">Escolher combustível</option>
            {fuels.map(f=> <option key={f.id} value={f.name}>{f.name}</option>)}
          </select>
          <input placeholder="Novo combustível" value={newFuel} onChange={e=>setNewFuel(e.target.value)} />
          <button type="button" onClick={async ()=>{ if (!newFuel) return; const res = await fetch(apiUrl('/api/fuels'), { method:'POST', headers:{'Content-Type':'application/json','Authorization': 'Bearer '+token}, body: JSON.stringify({ name: newFuel }) }); if (res.ok){ setNewFuel(''); const r = await fetch(apiUrl('/api/fuels')); const dd = await r.json(); setFuels(dd || []); alert('Combustível adicionado'); } else { alert('Erro ao adicionar combustível') } }} >Adicionar</button>
        </div>
        <input placeholder="Cavalos" value={form.hp} onChange={e=>setForm({...form,hp:e.target.value})} />
        <input placeholder="Lugares" value={form.seats} onChange={e=>setForm({...form,seats:e.target.value})} />
        <input placeholder="Cilindrada" value={form.displacement} onChange={e=>setForm({...form,displacement:e.target.value})} />
        <input type="file" multiple onChange={e=>setFiles(e.target.files)} />
        <button className="btn" type="submit">Criar Veículo</button>
      </form>

      <h3 style={{marginTop:20}}>Veículos existentes</h3>
      <div style={{display:'grid',gap:8}}>
        {vehicles.map(v=> (<div key={v.id} style={{padding:10,background:'#fff'}}>{v.title} — €{v.price}</div>))}
      </div>
    </section>
  )
}
