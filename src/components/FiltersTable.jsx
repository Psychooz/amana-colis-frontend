import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';

const FiltersTable = ({ filters, onFilterChange, onApplyFilters, onResetFilters }) => {
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

  const columnHelper = createColumnHelper();

  // Première rangée de colonnes
  const firstRowColumns = useMemo(() => [
    columnHelper.accessor('codeEnvoi', {
      header: 'Code envoi',
      cell: () => (
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Rechercher..."
          value={filters.codeEnvoi || ''}
          onChange={(e) => onFilterChange('codeEnvoi', e.target.value)}
        />
      ),
    }),
    columnHelper.accessor('telDestinataire', {
      header: 'Tél destinataire',
      cell: () => (
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="06xxxxxxxx"
          value={filters.telDestinataire || ''}
          onChange={(e) => onFilterChange('telDestinataire', e.target.value)}
        />
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Statut',
      cell: () => (
        <select
          className="form-select form-select-sm"
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ),
    }),
    columnHelper.accessor('destination', {
      header: 'Destination',
      cell: () => (
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Ville..."
          value={filters.destination || ''}
          onChange={(e) => onFilterChange('destination', e.target.value)}
        />
      ),
    }),
    columnHelper.accessor('isPayed', {
      header: 'Paiement',
      cell: () => (
        <select
          className="form-select form-select-sm"
          value={filters.isPayed || ''}
          onChange={(e) => onFilterChange('isPayed', e.target.value)}
        >
          {paymentOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ),
    }),
  ], [filters, onFilterChange]);

  // Deuxième rangée de colonnes  
  const secondRowColumns = useMemo(() => [
    columnHelper.accessor('dateDepot', {
      header: 'Date dépôt',
      cell: () => (
        <div className="row g-1">
          <div className="col-6">
            <input
              type="date"
              className="form-control form-control-sm"
              placeholder="Du"
              value={filters.dateDepotStart || ''}
              onChange={(e) => onFilterChange('dateDepotStart', e.target.value)}
            />
          </div>
          <div className="col-6">
            <input
              type="date"
              className="form-control form-control-sm"
              placeholder="Au"
              value={filters.dateDepotEnd || ''}
              onChange={(e) => onFilterChange('dateDepotEnd', e.target.value)}
            />
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('dateStatut', {
      header: 'Date statut',
      cell: () => (
        <div className="row g-1">
          <div className="col-6">
            <input
              type="date"
              className="form-control form-control-sm"
              placeholder="Du"
              value={filters.dateStatutStart || ''}
              onChange={(e) => onFilterChange('dateStatutStart', e.target.value)}
            />
          </div>
          <div className="col-6">
            <input
              type="date"
              className="form-control form-control-sm"
              placeholder="Au"
              value={filters.dateStatutEnd || ''}
              onChange={(e) => onFilterChange('dateStatutEnd', e.target.value)}
            />
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('datePaiement', {
      header: 'Date paiement',
      cell: () => (
        <div className="row g-1">
          <div className="col-6">
            <input
              type="date"
              className="form-control form-control-sm"
              placeholder="Du"
              value={filters.datePaiementStart || ''}
              onChange={(e) => onFilterChange('datePaiementStart', e.target.value)}
            />
          </div>
          <div className="col-6">
            <input
              type="date"
              className="form-control form-control-sm"
              placeholder="Au"
              value={filters.datePaiementEnd || ''}
              onChange={(e) => onFilterChange('datePaiementEnd', e.target.value)}
            />
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('actions', {
      header: 'Actions',
      cell: () => (
        <div className="d-flex gap-1">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onApplyFilters}
          >
            <i className="bi bi-search"></i>
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onResetFilters}
          >
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      ),
    }),
  ], [filters, onFilterChange, onApplyFilters, onResetFilters]);

  // Tables pour les deux rangées
  const firstRowTable = useReactTable({
    data: [{}], // Une seule rangée vide pour les inputs
    columns: firstRowColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const secondRowTable = useReactTable({
    data: [{}], // Une seule rangée vide pour les inputs
    columns: secondRowColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h6 className="mb-0">
          <i className="bi bi-funnel me-2"></i>
          Filtres avancés
        </h6>
      </div>
      <div className="card-body">
        {/* Première rangée */}
        <div className="table-responsive mb-3">
          <table className="table table-borderless mb-0">
            <thead>
              {firstRowTable.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} style={{ width: '20%' }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {firstRowTable.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Deuxième rangée */}
        <div className="table-responsive">
          <table className="table table-borderless mb-0">
            <thead>
              {secondRowTable.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} style={{ width: '25%' }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {secondRowTable.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FiltersTable;