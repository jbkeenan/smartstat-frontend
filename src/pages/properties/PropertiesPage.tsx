import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import PropertyCard from '../../components/property/PropertyCard';
import AddPropertyModal from '../../components/property/AddPropertyModal';

const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await propertyService.getProperties();
      setProperties(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = async (propertyData: any) => {
    try {
      await propertyService.createProperty(propertyData);
      setShowAddModal(false);
      fetchProperties(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add property');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyService.deleteProperty(id);
        fetchProperties(); // Refresh the list
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to delete property');
      }
    }
  };

  // Filter properties based on search term and type filter
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || property.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <h1>Properties</h1>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowAddModal(true)}
            >
              Add Property
            </button>
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          <div className="filters-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-dropdown">
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="vacation">Vacation Rental</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading properties...</p>
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="properties-grid">
              {filteredProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onDelete={() => handleDeleteProperty(property.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No properties found</h3>
              <p>
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by adding your first property'}
              </p>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowAddModal(true)}
              >
                Add Property
              </button>
            </div>
          )}
        </main>
      </div>

      {showAddModal && (
        <AddPropertyModal
          onAdd={handleAddProperty}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default PropertiesPage;
