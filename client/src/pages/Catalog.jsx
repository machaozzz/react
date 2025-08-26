import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { Search, Filter, Grid, List, Eye, Heart, Share2, Car, Zap, Users, Fuel, Calendar, Settings, ChevronDown, X, SlidersHorizontal, TrendingUp, Star } from 'lucide-react';
import VehicleModal from '../components/VehicleModal';
import { apiUrl } from '../api';

// Advanced Search Panel Component
function AdvancedSearchPanel({ isOpen, onToggle, filters, onFilterChange, onReset, resultsCount }) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start(isOpen ? "open" : "closed");
  }, [isOpen, controls]);

  const panelVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <div className="search-panel">
      <div className="search-header">
        <div className="search-title">
          <Search className="search-icon" />
          <span>Pesquisa Avançada</span>
          {resultsCount !== null && (
            <motion.span 
              className="results-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={resultsCount}
            >
              {resultsCount} resultados
            </motion.span>
          )}
        </div>
        <motion.button 
          className="search-toggle"
          onClick={onToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SlidersHorizontal size={16} />
          {isOpen ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="search-content"
            variants={panelVariants}
            initial="closed"
            animate={controls}
            exit="closed"
          >
            <div className="search-grid">
              <motion.div className="search-field" variants={itemVariants}>
                <label className="search-label">
                  <Search size={14} />
                  Pesquisa Geral
                </label>
                <input
                  className="search-input"
                  placeholder="Marca, modelo, descrição..."
                  value={filters.q}
                  onChange={(e) => onFilterChange('q', e.target.value)}
                />
              </motion.div>

              <motion.div className="search-field" variants={itemVariants}>
                <label className="search-label">
                  <Fuel size={14} />
                  Combustível
                </label>
                <select
                  className="search-select"
                  value={filters.fuel}
                  onChange={(e) => onFilterChange('fuel', e.target.value)}
                >
                  <option value="">Todos os combustíveis</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Gasóleo">Gasóleo</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Elétrico">Elétrico</option>
                  <option value="GPL">GPL</option>
                </select>
              </motion.div>

              <motion.div className="search-field" variants={itemVariants}>
                <label className="search-label">
                  <Calendar size={14} />
                  Ano Mínimo
                </label>
                <select
                  className="search-select"
                  value={filters.yearMin}
                  onChange={(e) => onFilterChange('yearMin', e.target.value)}
                >
                  <option value="">Qualquer ano</option>
                  {Array.from({length: 10}, (_, i) => 2025 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </motion.div>

              <motion.div className="search-field" variants={itemVariants}>
                <label className="search-label">
                  <Users size={14} />
                  Lugares
                </label>
                <select
                  className="search-select"
                  value={filters.seats}
                  onChange={(e) => onFilterChange('seats', e.target.value)}
                >
                  <option value="">Qualquer</option>
                  <option value="2">2 lugares</option>
                  <option value="4">4 lugares</option>
                  <option value="5">5 lugares</option>
                  <option value="7">7 lugares</option>
                </select>
              </motion.div>

              <motion.div className="search-field price-range" variants={itemVariants}>
                <label className="search-label">
                  <TrendingUp size={14} />
                  Faixa de Preço
                </label>
                <div className="price-inputs">
                  <input
                    className="search-input"
                    type="number"
                    placeholder="Preço mínimo"
                    value={filters.priceMin}
                    onChange={(e) => onFilterChange('priceMin', e.target.value)}
                  />
                  <span className="price-separator">até</span>
                  <input
                    className="search-input"
                    type="number"
                    placeholder="Preço máximo"
                    value={filters.priceMax}
                    onChange={(e) => onFilterChange('priceMax', e.target.value)}
                  />
                </div>
              </motion.div>

              <motion.div className="search-field" variants={itemVariants}>
                <label className="search-label">
                  <Zap size={14} />
                  Potência Mínima (CV)
                </label>
                <input
                  className="search-input"
                  type="number"
                  placeholder="Ex: 200"
                  value={filters.hpMin}
                  onChange={(e) => onFilterChange('hpMin', e.target.value)}
                />
              </motion.div>
            </div>

            <div className="search-actions">
              <div className="results-count">
                {resultsCount !== null && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={resultsCount}
                  >
                    {resultsCount} veículos encontrados
                  </motion.span>
                )}
              </div>
              <motion.button
                className="btn btn-ghost btn-sm"
                onClick={onReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={16} />
                Limpar Filtros
              </motion.button>
              <motion.button
                className="btn btn-primary btn-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search size={16} />
                Pesquisar
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VehicleCard({ vehicle, index, viewMode, onView, onToggleFavorite, isFavorite }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const overlayVariants = {
    rest: { opacity: 0 },
    hover: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.article
      ref={ref}
      className={`vehicle-card ${viewMode === 'list' ? 'list-view' : ''}`}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover="hover"
      onClick={() => onView(vehicle)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onView(vehicle); }}
    >
      <div className="vehicle-image-container">
        <motion.img
          src={vehicle.image || (vehicle.images && vehicle.images[0]) || '/demo/car.svg'}
          alt={vehicle.title}
          className="vehicle-image"
          variants={imageVariants}
          loading="lazy"
        />
        
        <motion.div 
          className="vehicle-image-overlay"
          variants={overlayVariants}
        />
        
        <div className="vehicle-badges">
          {vehicle.featured && (
            <motion.span 
              className="vehicle-badge featured"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
            >
              DESTAQUE
            </motion.span>
          )}
          {vehicle.year >= 2023 && (
            <motion.span 
              className="vehicle-badge new"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 + 0.6, type: "spring" }}
            >
              NOVO
            </motion.span>
          )}
          {vehicle.hp > 300 && (
            <motion.span 
              className="vehicle-badge premium"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.7, type: "spring" }}
            >
              PREMIUM
            </motion.span>
          )}
        </div>

        <motion.div 
          className="vehicle-price-tag"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          €{Number(vehicle.price || 0).toLocaleString()}
        </motion.div>

        <motion.div 
          className="vehicle-quick-actions"
          variants={overlayVariants}
        >
          <motion.button
            className={`btn-icon ${isFavorite ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(vehicle.id);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </motion.button>
          <motion.button
            className="btn-icon"
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({
                  title: vehicle.title,
                  text: `Confira este ${vehicle.title} por €${Number(vehicle.price || 0).toLocaleString()}`,
                  url: window.location.href
                });
              } else {
                // Fallback for browsers without Web Share API
                navigator.clipboard.writeText(window.location.href);
                alert('Link copiado para o clipboard!');
              }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Partilhar veículo"
          >
            <Share2 size={16} />
          </motion.button>
        </motion.div>

        {/* Rating Stars (se existir rating) */}
        {vehicle.rating && (
          <motion.div 
            className="vehicle-rating"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.8 }}
          >
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                fill={i < vehicle.rating ? "currentColor" : "none"}
                className="rating-star"
              />
            ))}
            <span className="rating-text">({vehicle.rating})</span>
          </motion.div>
        )}
      </div>

      <div className="vehicle-content">
        <motion.h3 
          className="vehicle-title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          {vehicle.title}
        </motion.h3>
        
        <motion.p 
          className="vehicle-description"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.5 }}
        >
          {vehicle.description ? 
            (vehicle.description.length > 120 ? 
              vehicle.description.slice(0, 120) + '...' : 
              vehicle.description
            ) : 
            'Descrição não disponível'
          }
        </motion.p>

        <div className="vehicle-specs">
          <motion.div 
            className="spec-item"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.6 }}
          >
            <Calendar className="spec-icon" size={14} />
            <div className="spec-content">
              <span className="spec-label">Ano</span>
              <span className="spec-value">{vehicle.year || '—'}</span>
            </div>
          </motion.div>

          <motion.div 
            className="spec-item"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.7 }}
          >
            <Fuel className="spec-icon" size={14} />
            <div className="spec-content">
              <span className="spec-label">Combustível</span>
              <span className="spec-value">{vehicle.fuel || '—'}</span>
            </div>
          </motion.div>

          <motion.div 
            className="spec-item"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.8 }}
          >
            <Zap className="spec-icon" size={14} />
            <div className="spec-content">
              <span className="spec-label">Potência</span>
              <span className="spec-value">{vehicle.hp || '—'} CV</span>
            </div>
          </motion.div>

          <motion.div 
            className="spec-item"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.9 }}
          >
            <Users className="spec-icon" size={14} />
            <div className="spec-content">
              <span className="spec-label">Lugares</span>
              <span className="spec-value">{vehicle.seats || '—'}</span>
            </div>
          </motion.div>
        </div>

        <div className="vehicle-actions">
          <motion.button
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onView(vehicle);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 1 }}
          >
            <Eye size={16} />
            Ver Detalhes
          </motion.button>

          {/* Quick Contact Button */}
          <motion.button
            className="btn btn-ghost btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              // Quick contact functionality - could open a modal or redirect
              window.location.href = `/contact?vehicle=${vehicle.id}`;
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 1.1 }}
          >
            Contactar
          </motion.button>
        </div>

        {/* Vehicle Status Indicator */}
        <motion.div 
          className={`vehicle-status ${vehicle.available ? 'available' : 'unavailable'}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 + 1.2 }}
        >
          <div className="status-indicator"></div>
          <span className="status-text">
            {vehicle.available !== false ? 'Disponível' : 'Indisponível'}
          </span>
        </motion.div>
      </div>

      {/* Hover Effect Glow */}
      <motion.div 
        className="card-glow"
        variants={overlayVariants}
      />
    </motion.article>
  );
}
// Loading Skeleton Component
function VehicleSkeleton({ viewMode, index }) {
  return (
    <motion.div 
      className={`skeleton skeleton-card ${viewMode === 'list' ? 'list' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="skeleton-image">
        <motion.div 
          className="skeleton-shimmer"
          animate={{
            x: [-100, 100],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear"
          }}
        />
      </div>
      <div className="skeleton-content">
        <div className="skeleton-title">
          <motion.div 
            className="skeleton-shimmer"
            animate={{ x: [-100, 100] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.1 }}
          />
        </div>
        <div className="skeleton-description">
          <motion.div 
            className="skeleton-shimmer"
            animate={{ x: [-100, 100] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.2 }}
          />
        </div>
        <div className="skeleton-specs">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton-spec">
              <motion.div 
                className="skeleton-shimmer"
                animate={{ x: [-100, 100] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.3 + i * 0.1 }}
              />
            </div>
          ))}
        </div>
        <div className="skeleton-actions">
          <div className="skeleton-button">
            <motion.div 
              className="skeleton-shimmer"
              animate={{ x: [-100, 100] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.7 }}
            />
          </div>
          <div className="skeleton-button secondary">
            <motion.div 
              className="skeleton-shimmer"
              animate={{ x: [-100, 100] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.8 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Advanced Pagination Component
function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <motion.div 
      className="pagination-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="pagination-info">
        <span>
          Mostrando {startItem} a {endItem} de {totalItems} veículos
        </span>
      </div>
      
      <div className="pagination">
        <motion.button
          className="pagination-btn pagination-arrow"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
          whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
          aria-label="Página anterior"
        >
          <ChevronDown size={16} style={{ transform: 'rotate(90deg)' }} />
          Anterior
        </motion.button>

        <div className="pagination-pages">
          {getVisiblePages().map((page, index) => (
            <motion.button
              key={index}
              className={`pagination-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              whileHover={{ scale: page !== '...' && page !== currentPage ? 1.05 : 1 }}
              whileTap={{ scale: page !== '...' && page !== currentPage ? 0.95 : 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              aria-label={typeof page === 'number' ? `Página ${page}` : undefined}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </motion.button>
          ))}
        </div>

        <motion.button
          className="pagination-btn pagination-arrow"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
          whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
          aria-label="Próxima página"
        >
          Seguinte
          <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
        </motion.button>
      </div>

      {/* Quick page jump */}
      <div className="pagination-jump">
        <span>Ir para:</span>
        <select 
          value={currentPage}
          onChange={(e) => onPageChange(parseInt(e.target.value))}
          className="pagination-select"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <option key={page} value={page}>
              Página {page}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}

// No Results Component
function NoResults({ onResetFilters, hasFilters }) {
  return (
    <motion.div 
      className="no-results"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="no-results-icon"
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Car size={64} />
      </motion.div>
      
      <motion.h3 
        className="no-results-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {hasFilters ? 'Nenhum veículo encontrado' : 'Catálogo em construção'}
      </motion.h3>
      
      <motion.p 
        className="no-results-message"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {hasFilters 
          ? 'Tente ajustar os seus filtros de pesquisa ou explore outras opções.'
          : 'Estamos a preparar uma seleção exclusiva de veículos premium para si.'
        }
      </motion.p>
      
      <motion.div 
        className="no-results-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {hasFilters && (
          <motion.button
            className="btn btn-primary"
            onClick={onResetFilters}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={16} />
            Limpar Filtros
          </motion.button>
        )}
        
        <motion.button
          className="btn btn-ghost"
          onClick={() => window.location.href = '/contact'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Contactar Stand
        </motion.button>
      </motion.div>
      
      {/* Decorative elements */}
      <div className="no-results-decoration">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="decoration-dot"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + i * 10}%`,
              top: `${60 + Math.sin(i) * 10}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Loading State Component
function LoadingState({ itemsPerPage, viewMode }) {
  return (
    <motion.div 
      className={`catalog-grid ${viewMode === 'list' ? 'list-view' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {Array.from({ length: itemsPerPage }).map((_, i) => (
        <VehicleSkeleton key={i} viewMode={viewMode} index={i} />
      ))}
    </motion.div>
  );
}

// Results Summary Component
function ResultsSummary({ 
  loading, 
  totalResults, 
  currentPage, 
  totalPages, 
  appliedFilters,
  onClearFilter 
}) {
  const hasFilters = Object.values(appliedFilters).some(value => value !== '');
  
  return (
    <motion.div 
      className="results-summary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="results-info">
        <motion.span 
          className="results-count"
          key={totalResults}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {loading ? (
            <span className="loading-text">
              <motion.span 
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Carregando...
              </motion.span>
            </span>
          ) : (
            `${totalResults} veículos encontrados`
          )}
        </motion.span>
        
        {totalPages > 1 && (
          <span className="page-info">
            Página {currentPage} de {totalPages}
          </span>
        )}
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <motion.div 
          className="active-filters"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <span className="filters-label">Filtros ativos:</span>
          <div className="filter-tags">
            {Object.entries(appliedFilters).map(([key, value]) => {
              if (!value) return null;
              
              const labels = {
                q: 'Pesquisa',
                fuel: 'Combustível',
                yearMin: 'Ano mín.',
                seats: 'Lugares',
                priceMin: 'Preço mín.',
                priceMax: 'Preço máx.',
                hpMin: 'Potência mín.'
              };
              
              return (
                <motion.span
                  key={key}
                  className="filter-tag"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {labels[key]}: {value}
                  <button
                    className="filter-tag-remove"
                    onClick={() => onClearFilter(key)}
                    aria-label={`Remover filtro ${labels[key]}`}
                  >
                    <X size={12} />
                  </button>
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
// Main Catalog Component - Part 1: States and Logic
export default function Catalog() {
  // Core States
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // UI States
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('catalog-view-mode') || 'grid';
  });
  const [sortBy, setSortBy] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('vehicle-favorites');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  
  // Filters
  const [filters, setFilters] = useState({
    q: '',
    fuel: '',
    yearMin: '',
    seats: '',
    priceMin: '',
    priceMax: '',
    hpMin: ''
  });

  // Advanced search history
  const [searchHistory, setSearchHistory] = useState(() => {
    const stored = localStorage.getItem('search-history');
    return stored ? JSON.parse(stored) : [];
  });

  const mountedRef = useRef(true);
  const searchTimeoutRef = useRef(null);

  // Debounced filters for performance
  const debouncedFilters = useMemo(() => {
    const handler = setTimeout(() => {
      return filters;
    }, 300);

    return () => clearTimeout(handler);
  }, [filters]);

  // Load vehicles on mount
  useEffect(() => {
    mountedRef.current = true;
    loadVehicles();
    
    return () => { 
      mountedRef.current = false; 
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Save view mode preference
  useEffect(() => {
    localStorage.setItem('catalog-view-mode', viewMode);
  }, [viewMode]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('vehicle-favorites', JSON.stringify([...favorites]));
  }, [favorites]);

  // Filter vehicles when filters or sort changes
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      filterAndSortVehicles();
    }, 300);
  }, [vehicles, filters, sortBy]);

  // Save search to history
  useEffect(() => {
    if (filters.q && filters.q.length > 2) {
      saveSearchToHistory(filters.q);
    }
  }, [filters.q]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await fetch(apiUrl('/api/vehicles'));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (mountedRef.current) {
        setVehicles(data || []);
        setInitialLoad(false);
      }
    } catch (error) {
      console.error('Failed to load vehicles:', error);
      if (mountedRef.current) {
        setVehicles([]);
        // Could show error toast here
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const filterAndSortVehicles = () => {
    let filtered = [...vehicles];

    // Apply text search
    if (filters.q) {
      const query = filters.q.toLowerCase().trim();
      filtered = filtered.filter(vehicle => {
        const searchableText = [
          vehicle.title,
          vehicle.description,
          vehicle.fuel,
          vehicle.brand,
          vehicle.model
        ].filter(Boolean).join(' ').toLowerCase();
        
        return searchableText.includes(query);
      });
    }

    // Apply category filters
    if (filters.fuel) {
      filtered = filtered.filter(vehicle => 
        vehicle.fuel?.toLowerCase() === filters.fuel.toLowerCase()
      );
    }

    if (filters.yearMin) {
      filtered = filtered.filter(vehicle => 
        parseInt(vehicle.year) >= parseInt(filters.yearMin)
      );
    }

    if (filters.seats) {
      filtered = filtered.filter(vehicle => 
        parseInt(vehicle.seats) >= parseInt(filters.seats)
      );
    }

    // Apply price range filters
    if (filters.priceMin) {
      filtered = filtered.filter(vehicle => 
        parseFloat(vehicle.price) >= parseFloat(filters.priceMin)
      );
    }

    if (filters.priceMax) {
      filtered = filtered.filter(vehicle => 
        parseFloat(vehicle.price) <= parseFloat(filters.priceMax)
      );
    }

    if (filters.hpMin) {
      filtered = filtered.filter(vehicle => 
        parseInt(vehicle.hp) >= parseInt(filters.hpMin)
      );
    }

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return parseFloat(a.price || 0) - parseFloat(b.price || 0);
          case 'price_desc':
            return parseFloat(b.price || 0) - parseFloat(a.price || 0);
          case 'year_desc':
            return parseInt(b.year || 0) - parseInt(a.year || 0);
          case 'year_asc':
            return parseInt(a.year || 0) - parseInt(b.year || 0);
          case 'hp_desc':
            return parseInt(b.hp || 0) - parseInt(a.hp || 0);
          case 'hp_asc':
            return parseInt(a.hp || 0) - parseInt(b.hp || 0);
          case 'name_asc':
            return (a.title || '').localeCompare(b.title || '');
          case 'name_desc':
            return (b.title || '').localeCompare(a.title || '');
          case 'featured':
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
          default:
            return 0;
        }
      });
    }

    setFilteredVehicles(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const saveSearchToHistory = (query) => {
    const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('search-history', JSON.stringify(newHistory));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
  };

  const handleResetFilters = () => {
    setFilters({
      q: '',
      fuel: '',
      yearMin: '',
      seats: '',
      priceMin: '',
      priceMax: '',
      hpMin: ''
    });
    setSortBy('');
    setSearchPanelOpen(false);
  };

  const handleToggleFavorite = (vehicleId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(vehicleId)) {
        newFavorites.delete(vehicleId);
      } else {
        newFavorites.add(vehicleId);
      }
      return newFavorites;
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Smooth scroll to top of results
    document.querySelector('.catalog-grid')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    // Add haptic feedback on supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Check if any filters are applied
  const hasActiveFilters = Object.values(filters).some(value => value !== '') || sortBy !== '';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Loading state for initial load
  if (initialLoad && loading) {
    return (
      <motion.section 
        className="catalog catalog-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="catalog-hero">
          <motion.div 
            className="loading-hero"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="catalog-title loading"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Carregando Catálogo...
            </motion.h1>
            <p className="catalog-subtitle">
              Preparando a melhor seleção de veículos para si
            </p>
          </motion.div>
        </div>
        <LoadingState itemsPerPage={itemsPerPage} viewMode={viewMode} />
      </motion.section>
    );
  }// Main JSX Render
  return (
    <motion.section 
      className="catalog"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Header with Animated Background */}
      <motion.div 
        className="catalog-hero"
        variants={itemVariants}
      >
        <div className="catalog-hero-bg">
          <motion.div 
            className="hero-gradient-orb orb-1"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="hero-gradient-orb orb-2"
            animate={{
              x: [0, -80, 0],
              y: [0, 30, 0],
              scale: [1.2, 1, 1.2],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
          />
        </div>
        
        <div className="catalog-hero-content">
          <motion.h1 
            className="catalog-title"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Catálogo Premium
            <motion.span 
              className="title-accent"
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              2025
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="catalog-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Descubra a nossa seleção exclusiva de veículos premium, 
            cada um cuidadosamente inspecionado e certificado para a máxima qualidade.
          </motion.p>

          {/* Quick Stats */}
          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="stat-item">
              <motion.span 
                className="stat-number"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
              >
                {vehicles.length}
              </motion.span>
              <span className="stat-label">Veículos</span>
            </div>
            <div className="stat-item">
              <motion.span 
                className="stat-number"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
              >
                {new Set(vehicles.map(v => v.fuel)).size}
              </motion.span>
              <span className="stat-label">Combustíveis</span>
            </div>
            <div className="stat-item">
              <motion.span 
                className="stat-number"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
              >
                {new Set(vehicles.map(v => v.year)).size}
              </motion.span>
              <span className="stat-label">Anos</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Advanced Search Panel */}
      <motion.div variants={itemVariants}>
        <AdvancedSearchPanel
          isOpen={searchPanelOpen}
          onToggle={() => setSearchPanelOpen(!searchPanelOpen)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          resultsCount={filteredVehicles.length}
        />
      </motion.div>

      {/* Catalog Controls */}
      <motion.div 
        className="catalog-controls"
        variants={itemVariants}
      >
        <div className="controls-left">
          <div className="view-controls">
            <div className="view-toggle">
              <motion.button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('grid')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Vista em grelha"
              >
                <Grid size={16} />
                <span className="btn-text">Grelha</span>
              </motion.button>
              <motion.button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('list')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Vista em lista"
              >
                <List size={16} />
                <span className="btn-text">Lista</span>
              </motion.button>
            </div>

            {/* Items per page selector */}
            <div className="items-per-page">
              <label htmlFor="items-per-page">Mostrar:</label>
              <select
                id="items-per-page"
                className="items-select"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={18}>18</option>
                <option value={24}>24</option>
              </select>
            </div>
          </div>
        </div>

        <div className="controls-right">
          <div className="sort-controls">
            <label htmlFor="sort-select" className="sort-label">
              <Settings size={14} />
              Ordenar por:
            </label>
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Relevância</option>
              <option value="featured">Destaques</option>
              <option value="price_asc">Preço: Menor → Maior</option>
              <option value="price_desc">Preço: Maior → Menor</option>
              <option value="year_desc">Ano: Mais Recente</option>
              <option value="year_asc">Ano: Mais Antigo</option>
              <option value="hp_desc">Potência: Maior → Menor</option>
              <option value="hp_asc">Potência: Menor → Maior</option>
              <option value="name_asc">Nome: A → Z</option>
              <option value="name_desc">Nome: Z → A</option>
            </select>
          </div>

          {/* Quick filters */}
          <div className="quick-filters">
            <motion.button
              className={`quick-filter ${filters.fuel === 'Elétrico' ? 'active' : ''}`}
              onClick={() => handleFilterChange('fuel', filters.fuel === 'Elétrico' ? '' : 'Elétrico')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap size={14} />
              Elétrico
            </motion.button>
            <motion.button
              className={`quick-filter ${filters.yearMin === '2023' ? 'active' : ''}`}
              onClick={() => handleFilterChange('yearMin', filters.yearMin === '2023' ? '' : '2023')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star size={14} />
              Recentes
            </motion.button>
            <motion.button
              className={`quick-filter ${filters.hpMin === '300' ? 'active' : ''}`}
              onClick={() => handleFilterChange('hpMin', filters.hpMin === '300' ? '' : '300')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap size={14} />
              Alto Desempenho
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Results Summary */}
      <ResultsSummary
        loading={loading}
        totalResults={filteredVehicles.length}
        currentPage={currentPage}
        totalPages={totalPages}
        appliedFilters={filters}
        onClearFilter={handleClearFilter}
      />

      {/* Search History (if search is active) */}
      {filters.q && searchHistory.length > 0 && (
        <motion.div 
          className="search-history"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <span className="history-label">Pesquisas recentes:</span>
          <div className="history-items">
            {searchHistory.slice(0, 5).map((query, index) => (
              <motion.button
                key={query}
                className="history-item"
                onClick={() => handleFilterChange('q', query)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search size={12} />
                {query}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Vehicle Grid/List */}
      {loading && !initialLoad ? (
        <LoadingState itemsPerPage={itemsPerPage} viewMode={viewMode} />
      ) : currentVehicles.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${viewMode}-${currentPage}-${sortBy}`}
            className={`catalog-grid ${viewMode === 'list' ? 'list-view' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {currentVehicles.map((vehicle, index) => (
              <VehicleCard
                key={`${vehicle.id}-${currentPage}`}
                vehicle={vehicle}
                index={index}
                viewMode={viewMode}
                onView={setSelectedVehicle}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.has(vehicle.id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <NoResults 
          onResetFilters={handleResetFilters}
          hasFilters={hasActiveFilters}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredVehicles.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* Vehicle Modal */}
      {selectedVehicle && (
        <VehicleModal 
          vehicle={selectedVehicle} 
          onClose={() => setSelectedVehicle(null)} 
        />
      )}

      {/* Floating Action Button for Mobile */}
      <motion.button
        className="mobile-search-fab"
        onClick={() => setSearchPanelOpen(!searchPanelOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <motion.div
          animate={{ rotate: searchPanelOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Search size={24} />
        </motion.div>
      </motion.button>
    </motion.section>
  );
}