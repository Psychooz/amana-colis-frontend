import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { colisAPI } from '../services/api';
import { useFilters } from './';
import AdvancedFilters from './shared/AdvancedFilters';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';

const ColisTable = () => {
  const { user } = useAuth();
  const [colis, setColis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const {
    filters,
    showFilters,
    handleFilterChange,
    handleResetFilters,
    handleToggleFilters,
    hasActiveFilters,
    getFilterParams
  } = useFilters();
  
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  const [sorting, setSorting] = useState([
    { id: 'dateDepot', desc: true }
  ]);

  const fetchColis = async (useFilters = false) => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      let response;
      
      if (useFilters && hasActiveFilters()) {
        const filterParams = {
          page: pagination.page,
          size: pagination.size,
          sortBy: sorting[0]?.id || 'dateDepot',
          sortDir: sorting[0]?.desc ? 'desc' : 'asc',
          ...getFilterParams()
        };
        
        response = await colisAPI.getColisWithFilters(user.id, filterParams);
      } else {
        response = await colisAPI.getColisByClient(
          user.id,
          pagination.page,
          pagination.size,
          sorting[0]?.id || 'dateDepot',
          sorting[0]?.desc ? 'desc' : 'asc'
        );
      }

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
    fetchColis(hasActiveFilters());
  }, [user?.id, pagination.page, pagination.size, sorting]);

  const handleApplyFilters = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
    fetchColis(true);
  };

  const handleResetFiltersAndRefresh = () => {
    handleResetFilters();
    setPagination(prev => ({ ...prev, page: 0 }));
    fetchColis(false);
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

  const columnHelper = createColumnHelper();

  const columns = useMemo(() => [
    columnHelper.accessor('codeEnvoi', {
      header: 'Code envoi',
      cell: info => (
        <code className="text-primary">{info.getValue()}</code>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('dateDepot', {
      header: 'Date dépôt',
      cell: info => formatDate(info.getValue()),
      enableSorting: true,
    }),
    columnHelper.accessor('destination', {
      header: 'Destination',
      cell: info => (
        <span className="badge bg-secondary">{info.getValue()}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('status', {
      header: 'Statut',
      cell: info => (
        <span className={getStatusBadgeClass(info.getValue())}>
          {getStatusDisplayName(info.getValue())}
        </span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('dateStatut', {
      header: 'Date statut',
      cell: info => formatDate(info.getValue()),
      enableSorting: true,
    }),
    columnHelper.accessor('crbt', {
      header: 'CRBT',
      cell: info => (
        <div className="text-end">{formatCurrency(info.getValue())}</div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('poids', {
      header: 'Poids',
      cell: info => (
        <div className="text-end">{info.getValue()} kg</div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('destinataire', {
      header: 'Destinataire',
      enableSorting: true,
    }),
    columnHelper.accessor('telDestinataire', {
      header: 'Tél destinataire',
      enableSorting: true,
    }),
    columnHelper.accessor('datePaiement', {
      header: 'Date paiement',
      cell: info => formatDate(info.getValue()),
      enableSorting: true,
    }),
    columnHelper.accessor('isPayed', {
      header: 'Payé',
      cell: info => (
        info.getValue() ? (
          <span className="badge bg-success">Payé</span>
        ) : (
          <span className="badge bg-warning">Impayé</span>
        )
      ),
      enableSorting: true,
    }),
  ], []);

  const table = useReactTable({
    data: colis,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    enableSortingRemoval: false,
  });

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;
    
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, startPage + 4);
    
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
          <AdvancedFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFiltersAndRefresh}
            showFilters={showFilters}
            onToggleFilters={handleToggleFilters}
            loading={loading}
          />

          <div className="table-container">
            <div className="p-3 border-bottom">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-0">Mes Envois</h5>
                  <small className="text-muted">
                    {pagination.totalElements} colis au total
                    {hasActiveFilters() && ' (filtré)'}
                  </small>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-end align-items-center gap-2">
                    <button
                      type="button"
                      className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={handleToggleFilters}
                    >
                      <i className="bi bi-funnel me-1"></i>
                      Filtres
                      {hasActiveFilters() && <span className="badge bg-danger ms-1">!</span>}
                    </button>
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

            {error && (
              <div className="alert alert-danger m-3" role="alert">
                {error}
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                          style={{ 
                            cursor: header.column.getCanSort() ? 'pointer' : 'default',
                            userSelect: 'none'
                          }}
                          className="position-relative"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {header.column.getCanSort() && (
                            <span className="ms-1">
                              {{
                                asc: '↑',
                                desc: '↓',
                              }[header.column.getIsSorted()] ?? '↕'}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-4 text-muted">
                        {hasActiveFilters() ? 'Aucun colis trouvé pour ces filtres' : 'Aucun colis trouvé'}
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map(row => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

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