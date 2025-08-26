import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// Advanced Image Gallery Hook
function useImageGallery(images) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const nextImage = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();
  };

  return {
    currentIndex,
    nextImage,
    prevImage,
    goToImage,
    isZoomed,
    setIsZoomed,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
}

// Image Gallery Component
function ImageGallery({ images, alt }) {
  const gallery = useImageGallery(images);
  const controls = useAnimation();
  const currentImage = images[gallery.currentIndex];

  useEffect(() => {
    controls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    });
  }, [gallery.currentIndex, controls]);

  const handleImageLoad = () => {
    controls.start({
      filter: "blur(0px)",
      transition: { duration: 0.3 }
    });
  };

  return (
    <div className="modal-gallery">
      <div className="gallery-main" {...gallery.touchHandlers}>
        <motion.div
          className="main-image-container"
          animate={controls}
          initial={{ opacity: 0, scale: 0.95 }}
        >
          <motion.img
            key={currentImage}
            src={currentImage}
            alt={alt}
            className={`main-image ${gallery.isZoomed ? 'zoomed' : ''}`}
            onLoad={handleImageLoad}
            initial={{ filter: "blur(4px)" }}
            animate={{ filter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            onClick={() => gallery.setIsZoomed(!gallery.isZoomed)}
            loading="lazy"
          />
          
          {/* Image Counter */}
          <div className="image-counter">
            {gallery.currentIndex + 1} / {images.length}
          </div>

          {/* Zoom Indicator */}
          <AnimatePresence>
            {gallery.isZoomed && (
              <motion.div
                className="zoom-indicator"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                🔍 Clique para reduzir
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              className="gallery-nav prev"
              onClick={gallery.prevImage}
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.95 }}
              disabled={gallery.currentIndex === 0}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>

            <motion.button
              className="gallery-nav next"
              onClick={gallery.nextImage}
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.95 }}
              disabled={gallery.currentIndex === images.length - 1}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="gallery-thumbnails">
          <div className="thumbnails-container">
            {images.map((image, index) => (
              <motion.button
                key={index}
                className={`thumbnail ${index === gallery.currentIndex ? 'active' : ''}`}
                onClick={() => gallery.goToImage(index)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} loading="lazy" />
                <div className="thumbnail-overlay" />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {images.length > 1 && (
        <div className="gallery-progress">
          <div 
            className="progress-fill"
            style={{ width: `${((gallery.currentIndex + 1) / images.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Vehicle Info Component
function VehicleInfo({ vehicle }) {
  const specs = [
    { 
      icon: '📅', 
      label: 'Ano', 
      value: vehicle.year || '—',
      color: 'primary' 
    },
    { 
      icon: '⛽', 
      label: 'Combustível', 
      value: vehicle.fuel || '—',
      color: 'accent' 
    },
    { 
      icon: '⚡', 
      label: 'Potência', 
      value: vehicle.hp ? `${vehicle.hp} CV` : '—',
      color: 'success' 
    },
    { 
      icon: '👥', 
      label: 'Lugares', 
      value: vehicle.seats || '—',
      color: 'warning' 
    },
    { 
      icon: '🔧', 
      label: 'Cilindrada', 
      value: vehicle.displacement ? `${vehicle.displacement}cc` : '—',
      color: 'primary' 
    },
    { 
      icon: '📏', 
      label: 'Quilómetros', 
      value: vehicle.mileage ? `${Number(vehicle.mileage).toLocaleString()} km` : '—',
      color: 'accent' 
    }
  ];

  return (
    <div className="vehicle-info">
      <div className="vehicle-header">
        <motion.h2 
          className="vehicle-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {vehicle.title}
        </motion.h2>
        
        <motion.div 
          className="vehicle-price"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
        >
          €{Number(vehicle.price || 0).toLocaleString()}
          {vehicle.negotiable && <span className="negotiable-badge">Negociável</span>}
        </motion.div>
      </div>

      {/* Vehicle Badges */}
      <motion.div 
        className="vehicle-badges"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {vehicle.condition === 'new' && <span className="badge new">Novo</span>}
        {vehicle.featured && <span className="badge featured">Destaque</span>}
        {vehicle.warranty && <span className="badge warranty">Garantia</span>}
        {vehicle.certified && <span className="badge certified">Certificado</span>}
      </motion.div>

      {/* Specifications Grid */}
      <motion.div 
        className="specs-grid"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {specs.map((spec, index) => (
          <motion.div
            key={spec.label}
            className={`spec-card ${spec.color}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
            whileHover={{ 
              scale: 1.02, 
              y: -2,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)"
            }}
          >
            <div className="spec-icon">{spec.icon}</div>
            <div className="spec-content">
              <div className="spec-label">{spec.label}</div>
              <div className="spec-value">{spec.value}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Description */}
      {vehicle.description && (
        <motion.div 
          className="vehicle-description"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h4>Descrição</h4>
          <p>{vehicle.description}</p>
        </motion.div>
      )}

      {/* Features List */}
      {vehicle.features && vehicle.features.length > 0 && (
        <motion.div 
          className="vehicle-features"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <h4>Equipamentos</h4>
          <div className="features-list">
            {vehicle.features.map((feature, index) => (
              <motion.span
                key={index}
                className="feature-item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 + index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                ✓ {feature}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Action Buttons Component
function ActionButtons({ vehicle, onClose }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleContact = () => {
    // Simulate contact action
    const message = `Olá! Tenho interesse no ${vehicle.title}. Podem contactar-me?`;
    const phone = '+351912345678';
    const whatsappUrl = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: vehicle.title,
          text: `Vê este ${vehicle.title} - €${Number(vehicle.price).toLocaleString()}`,
          url: window.location.href
        });
      } catch (err) {
        setShowShare(true);
      }
    } else {
      setShowShare(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically save to localStorage or send to API
  };

  return (
    <motion.div 
      className="action-buttons"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.8 }}
    >
      <motion.button
        className="btn btn-primary btn-contact"
        onClick={handleContact}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="btn-icon">📞</span>
        <span>Contactar Vendedor</span>
        <span className="btn-arrow">→</span>
      </motion.button>

      <div className="secondary-actions">
        <motion.button
          className={`btn btn-icon-only ${isFavorite ? 'active' : ''}`}
          onClick={handleFavorite}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Adicionar aos favoritos"
        >
          {isFavorite ? '❤️' : '🤍'}
        </motion.button>

        <motion.button
          className="btn btn-icon-only"
          onClick={handleShare}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Partilhar"
        >
          📤
        </motion.button>

        <motion.button
          className="btn btn-icon-only"
          onClick={handlePrint}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Imprimir"
        >
          🖨️
        </motion.button>
      </div>

      {/* Share Options */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            className="share-options"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="share-header">
              <span>Partilhar</span>
              <button onClick={() => setShowShare(false)}>✕</button>
            </div>
            <div className="share-buttons">
              <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
                📋 Copiar Link
              </button>
              <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}>
                📘 Facebook
              </button>
              <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(vehicle.title)}`)}>
                🐦 Twitter
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Main Vehicle Modal Component
export default function VehicleModal({ vehicle, onClose }) {
  const modalRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Prepare images array
  const images = vehicle?.images && vehicle.images.length 
    ? vehicle.images 
    : [vehicle?.image || '/demo/car-placeholder.jpg'];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!vehicle) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 60
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      y: 30,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="vehicle-modal-backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleBackdropClick}
      >
        <motion.div
          ref={modalRef}
          className="vehicle-modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Close Button */}
          <motion.button
            className="modal-close"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Fechar modal"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            ✕
          </motion.button>

          {/* Loading State */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="modal-loading"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="loading-spinner"></div>
                <span>Carregando detalhes...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Content */}
          <motion.div
            className="modal-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0 : 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="modal-gallery-section">
              <ImageGallery images={images} alt={vehicle.title} />
            </div>

            <div className="modal-info-section">
              <VehicleInfo vehicle={vehicle} />
              <ActionButtons vehicle={vehicle} onClose={onClose} />
            </div>
          </motion.div>

          {/* Floating Elements */}
          <div className="modal-particles">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="modal-particle"
                initial={{ 
                  x: Math.random() * 100,
                  y: Math.random() * 100,
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0],
                  x: Math.random() * 200,
                  y: Math.random() * 200
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: `linear-gradient(45deg, var(--primary), var(--accent))`,
                  pointerEvents: 'none'
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}