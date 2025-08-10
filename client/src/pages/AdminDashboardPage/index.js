import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { useAuth } from '../../context/AuthContext';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, token, isLoggedIn, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'admin') {
      setError('Access Denied: You are not authorized to view this page.');
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const usersResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!usersResponse.ok) {
          const errorData = await usersResponse.json();
          throw new Error(errorData.message || 'Failed to fetch users');
        }
        const usersData = await usersResponse.json();

        const statsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!statsResponse.ok) {
          const errorData = await statsResponse.json();
          throw new Error(errorData.message || 'Failed to fetch stats');
        }
        const statsData = await statsResponse.json();

        if (isMounted) {
          setUsers(usersData);
          setStats(statsData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'An error occurred while fetching admin data.');
          if (
            err.message.toLowerCase().includes('unauthorized') ||
            err.message.toLowerCase().includes('forbidden')
          ) {
            logout();
            navigate('/login');
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // prevent state update after unmount
    };
  }, [isLoggedIn, token, user, logout, navigate]);

  if (!isLoggedIn && !isLoading) {
    return <div className="admin-message">Please log in to view the admin dashboard.</div>;
  }

  if (error && error.includes('Access Denied')) {
    return (
      <div className="admin-page-container">
        <div className="admin-access-denied">
          <h2 className="admin-title">Access Denied</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="back-button">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <div className="container">
        <h2 className="admin-title">Admin Dashboard</h2>
        <p className="admin-subtitle">Overview of platform users and statistics.</p>

        {isLoading ? (
          <div className="loading-state">
            <div className="spinner" aria-label="Loading spinner"></div>
            <p>Loading admin data...</p>
          </div>
        ) : error ? (
          <div className="error-message" role="alert">
            <p>{error}</p>
          </div>
        ) : (
          <div className="admin-content">
            <section className="stats-section" aria-label="Platform Statistics">
              <h3>Platform Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <h4>Total Users</h4>
                  <p>{stats?.userCount ?? 0}</p>
                </div>
                <div className="stat-card">
                  <h4>Total Saved Gifts</h4>
                  <p>{stats?.totalSavedGifts ?? 0}</p>
                </div>
              </div>
            </section>

            <section className="users-section" aria-label="Users List">
              <h3>All Users</h3>
              {users.length > 0 ? (
                <div className="users-table-container" role="region" aria-live="polite">
                  <table className="users-table" aria-describedby="users-table-caption">
                    <caption id="users-table-caption">List of registered users</caption>
                    <thead>
                      <tr>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        <th scope="col">Member Since</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td>{u.username}</td>
                          <td>{u.email}</td>
                          <td>{u.role}</td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-users-message">No users found.</p>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
