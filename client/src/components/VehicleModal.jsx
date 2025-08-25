import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VehicleModal({ vehicle, onClose }) {
    const [idx, setIdx] = useState(0);
    const imgs = vehicle?.images && vehicle.images.length ? vehicle.images : [vehicle?.image || '/demo/car.svg'];

    useEffect(() => {
        function onKey(e) {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') setIdx(i => Math.min(i + 1, imgs.length - 1));
            if (e.key === 'ArrowLeft') setIdx(i => Math.max(i - 1, 0));
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [imgs.length, onClose]);

    if (!vehicle) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="vehicle-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="vehicle-modal"
                    initial={{ y: 50, scale: 0.95, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    exit={{ y: 30, scale: 0.98, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                >
                    <button className="vm-close" onClick={onClose} aria-label="Close">✕</button>

                    <div className="vm-left">
                        <div className="vm-image-wrap">
                            <motion.img
                                key={imgs[idx]}
                                src={imgs[idx]}
                                alt={vehicle.title}
                                className="vm-image"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                loading="lazy"
                            />
                        </div>

                        <div className="vm-thumbs">
                            {imgs.map((u, i) => (
                                <button
                                    key={i}
                                    className={`vm-thumb ${i === idx ? 'active' : ''}`}
                                    onClick={() => setIdx(i)}
                                    aria-label={`View image ${i+1}`}
                                >
                                    <img src={u} alt={`thumb ${i+1}`} loading="lazy" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="vm-right">
                        <h2 className="vm-title">{vehicle.title}</h2>
                        <div className="vm-price">€{Number(vehicle.price || 0).toLocaleString()}</div>

                        <div className="vm-specs">
                            <div><strong>Ano:</strong> {vehicle.year || '-'}</div>
                            <div><strong>Combustível:</strong> {vehicle.fuel || '-'}</div>
                            <div><strong>CV:</strong> {vehicle.hp || '-'}</div>
                            <div><strong>Assentos:</strong> {vehicle.seats || '-'}</div>
                        </div>

                        <p className="vm-desc">{vehicle.description || 'Sem descrição disponível.'}</p>

                        <div className="vm-actions">
                            <button className="btn btn-primary">Contactar vendedor</button>
                            <button className="btn btn-ghost" onClick={() => window.print()}>Guardar / Imprimir</button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}