import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import VehicleModal from '../components/VehicleModal';
import { apiUrl } from '../api';

function CarCard({ v, onOpen, i }) {
  return (
    <motion.article
      className="car-card"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03 }}
      onClick={() => onOpen(v)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpen(v); }}
    >
      <div className="card-media">
        <img src={v.image || (v.images && v.images[0]) || '/demo/car.svg'} alt={v.title} loading="lazy" className="card-image" />
        <div className="price-badge">€{Number(v.price||0).toLocaleString()}</div>
        <div className="veh-badge">{v.year || '—'}</div>
      </div>

      <div className="card-body">
        <h3 className="card-title">{v.title}</h3>
        <p className="card-desc">{v.description ? (v.description.slice(0,120) + (v.description.length>120 ? '…' : '')) : 'Descrição breve indisponível.'}</p>
        <ul className="card-specs">
          <li>{v.fuel || '-'}</li>
          <li>{v.hp || '-'} CV</li>
          <li>{v.seats || '-'} lugares</li>
        </ul>
      </div>
    </motion.article>
  );
}

export default function Catalog() {
  const [vehicles, setVehicles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [qInput, setQInput] = useState(''); // immediate input
  const [q, setQ] = useState(''); // debounced query
  const [fuels, setFuels] = useState([]);
  const [fuel, setFuel] = useState('');
  const [hpMin, setHpMin] = useState('');
  const [hpMax, setHpMax] = useState('');
  const [dispMin, setDispMin] = useState('');
  const [dispMax, setDispMax] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const mountedRef = useRef(true);

  // debounce qInput -> q
  useEffect(()=>{
    const t = setTimeout(()=> setQ(qInput.trim()), 380);
    return ()=> clearTimeout(t);
  }, [qInput]);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    async function load() {
      try {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (fuel) params.set('fuel', fuel);
        if (hpMin) params.set('hp_min', hpMin);
        if (hpMax) params.set('hp_max', hpMax);
        if (dispMin) params.set('disp_min', dispMin);
        if (dispMax) params.set('disp_max', dispMax);
        if (sort) params.set('sort', sort);
        const res = await fetch(apiUrl('/api/vehicles') + (params.toString() ? ('?' + params.toString()) : ''));
        const d = await res.json();
        if (mountedRef.current) setVehicles(d || []);
      } catch (e) {
        console.error('Failed to load vehicles', e);
        if (mountedRef.current) setVehicles([]);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }
    load();
    return () => { mountedRef.current = false; };
  }, [q, fuel, hpMin, hpMax, dispMin, dispMax, sort]);

  useEffect(()=>{ async function loadF(){ try{ const r = await fetch(apiUrl('/api/fuels')); const dd = await r.json(); setFuels(dd || []);}catch(e){console.error('Failed to fetch fuels', e)} } loadF(); }, []);

  // pagination helpers
  const total = vehicles.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(()=>{ if (page > totalPages) setPage(1); }, [totalPages]);
  const startIndex = (page-1) * pageSize;
  const pageItems = vehicles.slice(startIndex, startIndex + pageSize);

  return (
    <section className="catalog">
      <div className="catalog-hero">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
          <h2>Catálogo de Viaturas</h2>
          <div style={{color:'var(--muted)'}}>Encontre o seu próximo carro</div>
        </div>
        <div className="catalog-filters" style={{marginTop:12}}>
          <input className="filter-input" placeholder="Pesquisar (marca, modelo, descrição)" value={q} onChange={e=>setQ(e.target.value)} style={{flex:1}} />
          <select className="filter-select" value={fuel} onChange={e=>setFuel(e.target.value)}>
            <option value="">Todos combustíveis</option>
            {fuels.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
          </select>
          <input className="filter-input" placeholder="HP min" type="number" value={hpMin} onChange={e=>setHpMin(e.target.value)} />
          <input className="filter-input" placeholder="HP max" type="number" value={hpMax} onChange={e=>setHpMax(e.target.value)} />
          <input className="filter-input" placeholder="Cilindrada min" type="number" value={dispMin} onChange={e=>setDispMin(e.target.value)} />
          <input className="filter-input" placeholder="Cilindrada max" type="number" value={dispMax} onChange={e=>setDispMax(e.target.value)} />
          <select className="filter-select" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="">Ordenar</option>
            <option value="price_asc">Preço ↑</option>
            <option value="price_desc">Preço ↓</option>
            <option value="year_desc">Ano ↓</option>
          </select>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
        <div style={{display:'flex',gap:8}}>
          <button className={"btn"} onClick={()=>setView('grid')} aria-pressed={view==='grid'}>Grid</button>
          <button className={"btn btn-ghost"} onClick={()=>setView('list')} aria-pressed={view==='list'}>Lista</button>
          <select value={pageSize} onChange={e=>{ setPageSize(Number(e.target.value)); setPage(1); }}>
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
          </select>
        </div>
        <div style={{color:'var(--muted)'}}>{total} resultados</div>
      </div>

      {loading ? (
        <div className="catalog-grid">
          {Array.from({length: pageSize}).map((_,i)=>(<div key={i} className="car-skeleton" />))}
        </div>
      ) : (
        <div className={"catalog-grid" + (view==='list' ? ' list-view' : '')}>
          {(view==='grid' ? pageItems : pageItems).map((v, i) => <CarCard key={v.id || i} v={v} i={i} onOpen={(veh) => setSelected(veh)} view={view} />)}
        </div>
      )}

      {/* pagination controls */}
      <div style={{display:'flex',gap:8,justifyContent:'center',alignItems:'center',marginTop:18}}>
        <button className="btn" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Anterior</button>
        <div style={{padding:'8px 12px',color:'var(--muted)'}}>Página {page} / {totalPages}</div>
        <button className="btn" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Seguinte</button>
      </div>

      {selected && <VehicleModal vehicle={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
