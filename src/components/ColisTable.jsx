import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { colisAPI } from '../services/api';

const ColisTable = () => {
  const { user } = useAuth();
  const [colis, setColis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'id',
    sortDir: 'asc'
  });

  const fetchColis = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await colisAPI.getColisByClient(
        user.id,
        pagination.page,
        pagination.size,
        sortConfig.sortBy,
        sortConfig.sortDir
      );

      setColis(response.data.content || []);
      setPagination({
        page: response.data.number || 0,
        size: response.data.size || 10,
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0
      });
      setError('');
    } catch (error) {
      console.error('Error fetching colis:', error);
      setError('Erreur lors du chargement des colis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColis();
  }, [user?.id, pagination.page, pagination.size, sortConfig.sortBy, sortConfig.sortDir]);

  const handleSort = (column) => {
    setSortConfig(prev => ({
      sortBy: column,
      sortDir: prev.sortBy === column && prev.sortDir === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, size: parseInt(newSize), page: 0 }));
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'EN_TRANSIT': 'status-en-transit',
      'ECHEC_LIVRAISON_A_RECUPERER': 'status-echec',
      'ENVOI_LIVRE': 'status-livre',
      'ENVOI_RETOURNE': 'status-retourne',
      'DEPOSE': 'status-depose',
      'DEUXIEME_PRESENTATION': 'status-presentation'
    };
    return `status-badge ${statusMap[status] || ''}`;
  };

  const getStatusDisplayName = (status) => {
    const statusMap = {
      'EN_TRANSIT': 'En transit',
      'ECHEC_LIVRAISON_A_RECUPERER': 'Echec livraison, à récupérer',
      'ENVOI_LIVRE': 'Envoi livré',
      'ENVOI_RETOURNE': 'Envoi retourné',
      'DEPOSE': 'Déposé',
      'DEUXIEME_PRESENTATION': '2ème présentation'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `${amount} MAD`;
  };

  const SortableHeader = ({ column, children }) => (
    <th 
      onClick={() => handleSort(column)}
      style={{ cursor: 'pointer', userSelect: 'none' }}
      className="position-relative"
    >
      {children}
      {sortConfig.sortBy === column && (
        <span className="ms-1">{sortConfig.sortDir === 'asc' ? '↑' : '↓'}</span>
      )}
    </th>
  );

  // Simple pagination component
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;
    
    // Show max 5 page numbers
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, startPage + 4);
    
    // Adjust start if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(0, endPage - 4);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <nav>
        <ul className="pagination mb-0">
          <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              ‹
            </button>
          </li>
          
          {startPage > 0 && (
            <>
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(0)}>1</button>
              </li>
              {startPage > 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
            </>
          )}
          
          {pages.map((pageNum) => (
            <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum + 1}
              </button>
            </li>
          ))}
          
          {endPage < totalPages - 1 && (
            <>
              {endPage < totalPages - 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(totalPages - 1)}>
                  {totalPages}
                </button>
              </li>
            </>
          )}
          
          <li className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              ›
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="table-container">
            {/* Header */}
            <div className="p-3 border-bottom">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-0">Mes Envois</h5>
                  <small className="text-muted">
                    {pagination.totalElements} colis au total
                  </small>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-end align-items-center gap-2">
                    <label className="form-label mb-0 me-2">Afficher:</label>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: 'auto' }}
                      value={pagination.size}
                      onChange={(e) => handlePageSizeChange(e.target.value)}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger m-3" role="alert">
                {error}
              </div>
            )}

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <SortableHeader column="codeEnvoi">Code envoi</SortableHeader>
                    <SortableHeader column="dateDepot">Date dépôt</SortableHeader>
                    <SortableHeader column="destination">Destination</SortableHeader>
                    <SortableHeader column="status">Statut</SortableHeader>
                    <SortableHeader column="dateStatut">Date statut</SortableHeader>
                    <SortableHeader column="crbt">CRBT</SortableHeader>
                    <SortableHeader column="poids">Poids</SortableHeader>
                    <SortableHeader column="destinataire">Destinataire</SortableHeader>
                    <SortableHeader column="telDestinataire">Tél destinataire</SortableHeader>
                    <SortableHeader column="datePaiement">Date paiement</SortableHeader>
                    <SortableHeader column="isPayed">Payé</SortableHeader>
                  </tr>
                </thead>
                <tbody>
                  {colis.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center py-4 text-muted">
                        Aucun colis trouvé
                      </td>
                    </tr>
                  ) : (
                    colis.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <code className="text-primary">{item.codeEnvoi}</code>
                        </td>
                        <td>{formatDate(item.dateDepot)}</td>
                        <td>
                          <span className="badge bg-secondary">{item.destination}</span>
                        </td>
                        <td>
                          <span className={getStatusBadgeClass(item.status)}>
                            {getStatusDisplayName(item.status)}
                          </span>
                        </td>
                        <td>{formatDate(item.dateStatut)}</td>
                        <td className="text-end">{formatCurrency(item.crbt)}</td>
                        <td className="text-end">{item.poids} kg</td>
                        <td>{item.destinataire}</td>
                        <td>{item.telDestinataire}</td>
                        <td>{formatDate(item.datePaiement)}</td>
                        <td>
                          {item.isPayed ? (
                            <span className="badge bg-success">Payé</span>
                          ) : (
                            <span className="badge bg-warning">Impayé</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination-container">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-muted">
                    Page {pagination.page + 1} sur {pagination.totalPages} 
                    ({pagination.totalElements} total)
                  </div>
                  {renderPagination()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColisTable;