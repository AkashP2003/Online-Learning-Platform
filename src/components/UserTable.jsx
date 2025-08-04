import React, { useState, useMemo } from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Search, X } from 'lucide-react';
import '../style/UserTable.css';

const UserTable = ({ users, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      await onDelete(userId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return users.filter(user => {
      const username = (user.username || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      
      return username.includes(searchLower) || email.includes(searchLower);
    });
  }, [users, searchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="user-table-container">
      <div className="table-header">
        <div className="header-left">
          <h3>Users Management</h3>
          <span className="table-count">
            {filteredUsers.length} of {users.length} users
          </span>
        </div>
        
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by username or email..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="clear-search-btn"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  {searchTerm ? 
                    `No users found matching "${searchTerm}"` : 
                    'No users found'
                  }
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id || user.userId}>
                  <td>#{user.id || user.userId}</td>
                  <td className="user-name">
                    <div className="user-avatar">
                      {(user.username || 'U').charAt(0).toUpperCase()}
                    </div>
                    {user.username || 'Unknown'}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${(user.role || 'user').toLowerCase()}`}>
                      {user.role || 'USER'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.active !== false ? 'active' : 'inactive'}`}>
                      {user.active !== false ? (
                        <>
                          <CheckCircle size={14} />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle size={14} />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td>{formatDate(user.createdAt || user.joinDate)}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() => onEdit(user)}
                      className="action-btn edit-btn"
                      title="Edit User"
                    >
                      <Edit size={25} color='blue' />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id || user.userId, user.username)}
                      className="action-btn delete-btn"
                      title="Delete User"
                    >
                      <Trash2 size={25} color='red'/>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .search-container {
          display: flex;
          align-items: center;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.5rem;
          min-width: 300px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .search-input-wrapper:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-icon {
          color: #6b7280;
          margin-right: 0.5rem;
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.875rem;
          background: transparent;
          color: #374151;
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .clear-search-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          color: #6b7280;
          margin-left: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .clear-search-btn:hover {
          background-color: #f3f4f6;
          color: #374151;
        }

        .table-count {
          font-size: 0.875rem;
          color: #fff;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .table-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-left {
            justify-content: space-between;
          }

          .search-input-wrapper {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default UserTable;