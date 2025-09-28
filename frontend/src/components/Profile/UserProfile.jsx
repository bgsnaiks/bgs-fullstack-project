import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext.jsx';

function UserProfile() {
  const { user } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/auth/users');
      
      if (response.data.success) {
        setAllUsers(response.data.users);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
              <i className="bi bi-person-circle me-2"></i>
              User Dashboard
            </h2>
            <span className="badge bg-primary">
              {allUsers.length} Total Users
            </span>
          </div>

          {/* Navigation Tabs */}
          <ul className="nav nav-tabs mb-4" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
                type="button"
              >
                <i className="bi bi-person me-2"></i>
                My Profile
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
                type="button"
              >
                <i className="bi bi-people me-2"></i>
                All Users ({allUsers.length})
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content">
            {/* My Profile Tab */}
            {activeTab === 'profile' && (
              <div className="tab-pane fade show active">
                <div className="row">
                  <div className="col-md-8 mx-auto">
                    <div className="card shadow-sm">
                      <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">
                          <i className="bi bi-person-badge me-2"></i>
                          Personal Information
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">
                              <i className="bi bi-person me-2"></i>First Name
                            </label>
                            <div className="form-control-plaintext bg-light p-2 rounded">
                              {user?.firstName || 'N/A'}
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">
                              <i className="bi bi-person me-2"></i>Last Name
                            </label>
                            <div className="form-control-plaintext bg-light p-2 rounded">
                              {user?.lastName || 'N/A'}
                            </div>
                          </div>
                          <div className="col-md-12 mb-3">
                            <label className="form-label fw-bold">
                              <i className="bi bi-envelope me-2"></i>Email Address
                            </label>
                            <div className="form-control-plaintext bg-light p-2 rounded">
                              {user?.email || 'N/A'}
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">
                              <i className="bi bi-hash me-2"></i>User ID
                            </label>
                            <div className="form-control-plaintext bg-light p-2 rounded">
                              #{user?.id || 'N/A'}
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">
                              <i className="bi bi-calendar me-2"></i>Member Since
                            </label>
                            <div className="form-control-plaintext bg-light p-2 rounded">
                              {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* All Users Tab */}
            {activeTab === 'users' && (
              <div className="tab-pane fade show active">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <div className="card shadow-sm">
                  <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="bi bi-people-fill me-2"></i>
                      Registered Users
                    </h5>
                    <button 
                      className="btn btn-light btn-sm"
                      onClick={fetchAllUsers}
                      disabled={loading}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Refresh
                    </button>
                  </div>
                  <div className="card-body p-0">
                    {allUsers.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="bi bi-people display-1 text-muted"></i>
                        <h5 className="mt-3 text-muted">No users found</h5>
                        <p className="text-muted">Be the first to register!</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th scope="col">
                                <i className="bi bi-hash me-1"></i>ID
                              </th>
                              <th scope="col">
                                <i className="bi bi-person me-1"></i>Name
                              </th>
                              <th scope="col">
                                <i className="bi bi-envelope me-1"></i>Email
                              </th>
                              <th scope="col">
                                <i className="bi bi-calendar me-1"></i>Joined
                              </th>
                              <th scope="col">
                                <i className="bi bi-gear me-1"></i>Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {allUsers.map((userData, index) => (
                              <tr key={userData.id} className={userData.id === user?.id ? 'table-primary' : ''}>
                                <td>
                                  <span className="badge bg-secondary">
                                    #{userData.id}
                                  </span>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <i className="bi bi-person-circle me-2 text-primary"></i>
                                    <div>
                                      <div className="fw-medium">
                                        {userData.firstName} {userData.lastName}
                                      </div>
                                      {userData.id === user?.id && (
                                        <small className="text-primary">
                                          <i className="bi bi-star-fill me-1"></i>
                                          You
                                        </small>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <a href={`mailto:${userData.email}`} className="text-decoration-none">
                                    {userData.email}
                                  </a>
                                </td>
                                <td>
                                  <small className="text-muted">
                                    {formatDate(userData.createdAt)}
                                  </small>
                                </td>
                                <td>
                                  <span className="badge bg-success">
                                    <i className="bi bi-check-circle me-1"></i>
                                    Active
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="row mt-4">
                  <div className="col-md-4">
                    <div className="card text-center bg-primary text-white">
                      <div className="card-body">
                        <i className="bi bi-people display-4 mb-2"></i>
                        <h3 className="card-title">{allUsers.length}</h3>
                        <p className="card-text">Total Users</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card text-center bg-success text-white">
                      <div className="card-body">
                        <i className="bi bi-person-check display-4 mb-2"></i>
                        <h3 className="card-title">{allUsers.length}</h3>
                        <p className="card-text">Active Users</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card text-center bg-info text-white">
                      <div className="card-body">
                        <i className="bi bi-calendar-plus display-4 mb-2"></i>
                        <h3 className="card-title">
                          {allUsers.filter(u => {
                            const joinDate = new Date(u.createdAt);
                            const today = new Date();
                            const diffTime = Math.abs(today - joinDate);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            return diffDays <= 7;
                          }).length}
                        </h3>
                        <p className="card-text">New This Week</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
