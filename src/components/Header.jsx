import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="dashboard-header">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="d-flex align-items-center">
              <h3 style={{ color: '#667eea' }}>
                AMANA
              </h3>
              <span className="ms-2 text-muted">Dashboard</span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="d-flex justify-content-end">
              <div className="user-info">
                <div className="text-end">
                  <div className="fw-bold">{user?.nom} {user?.prenom}</div>
                  <small className="text-muted">{user?.email}</small>
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.profileType}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={logout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Se déconnecter
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;