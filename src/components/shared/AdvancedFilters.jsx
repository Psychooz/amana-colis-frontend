import React from 'react';

const AdvancedFilters = ({ 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  onResetFilters, 
  showFilters, 
  onToggleFilters,
  loading = false,
  title = "Filtres"
}) => {
  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'EN_TRANSIT', label: 'En transit' },
    { value: 'ECHEC_LIVRAISON_A_RECUPERER', label: 'Echec livraison, à récupérer' },
    { value: 'ENVOI_LIVRE', label: 'Envoi livré' },
    { value: 'ENVOI_RETOURNE', label: 'Envoi retourné' },
    { value: 'DEPOSE', label: 'Déposé' },
    { value: 'DEUXIEME_PRESENTATION', label: '2ème présentation' }
  ];

  const paymentOptions = [
    { value: '', label: 'Tous' },
    { value: 'true', label: 'Payé' },
    { value: 'false', label: 'Impayé' }
  ];

  if (!showFilters) {
    return (
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={onToggleFilters}
          disabled={loading}
        >
          <i className="bi bi-funnel me-1"></i>
          Afficher les filtres
        </button>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <i className="bi bi-funnel me-2"></i>
            {title}
          </h6>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onToggleFilters}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
      <div className="card-body">

        <div className="row g-3 mb-3">
          <div className="col-md-2">
            <label className="form-label">Code envoi</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Rechercher..."
              value={filters.codeEnvoi || ''}
              onChange={(e) => onFilterChange('codeEnvoi', e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Tél destinataire</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="06xxxxxxxx"
              value={filters.telDestinataire || ''}
              onChange={(e) => onFilterChange('telDestinataire', e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Statut</label>
            <select
              className="form-select form-select-sm"
              value={filters.status || ''}
              onChange={(e) => onFilterChange('status', e.target.value)}
              disabled={loading}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Destination</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Ville..."
              value={filters.destination || ''}
              onChange={(e) => onFilterChange('destination', e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Paiement</label>
            <select
              className="form-select form-select-sm"
              value={filters.isPayed || ''}
              onChange={(e) => onFilterChange('isPayed', e.target.value)}
              disabled={loading}
            >
              {paymentOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <div className="d-flex gap-1 w-100">
              <button
                type="button"
                className="btn btn-primary btn-sm flex-fill"
                onClick={onApplyFilters}
                disabled={loading}
              >
                <i className="bi bi-search me-1"></i>
                Appliquer
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={onResetFilters}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>
        </div>

        
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Date dépôt</label>
            <div className="row g-1">
              <div className="col-6">
                <input
                  type="date"
                  className="form-control form-control-sm"
                  placeholder="Du"
                  value={filters.dateDepotStart || ''}
                  onChange={(e) => onFilterChange('dateDepotStart', e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="col-6">
                <input
                  type="date"
                  className="form-control form-control-sm"
                  placeholder="Au"
                  value={filters.dateDepotEnd || ''}
                  onChange={(e) => onFilterChange('dateDepotEnd', e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <label className="form-label">Date statut</label>
            <div className="row g-1">
              <div className="col-6">
                <input
                  type="date"
                  className="form-control form-control-sm"
                  placeholder="Du"
                  value={filters.dateStatutStart || ''}
                  onChange={(e) => onFilterChange('dateStatutStart', e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="col-6">
                <input
                  type="date"
                  className="form-control form-control-sm"
                  placeholder="Au"
                  value={filters.dateStatutEnd || ''}
                  onChange={(e) => onFilterChange('dateStatutEnd', e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <label className="form-label">Date paiement</label>
            <div className="row g-1">
              <div className="col-6">
                <input
                  type="date"
                  className="form-control form-control-sm"
                  placeholder="Du"
                  value={filters.datePaiementStart || ''}
                  onChange={(e) => onFilterChange('datePaiementStart', e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="col-6">
                <input
                  type="date"
                  className="form-control form-control-sm"
                  placeholder="Au"
                  value={filters.datePaiementEnd || ''}
                  onChange={(e) => onFilterChange('datePaiementEnd', e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;