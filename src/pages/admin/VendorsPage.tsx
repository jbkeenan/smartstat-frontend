import React, { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { api } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

/**
 * Admin page for managing external vendor accounts.
 *
 * Administrators can view existing accounts for each supported vendor and
 * create new accounts by entering the required credentials.  Non-admin
 * users are denied access to this page.
 */
const VendorsPage: React.FC = () => {
  const { user } = useAuth();

  // State for loaded accounts by vendor
  const [cieloAccounts, setCieloAccounts] = useState<any[]>([]);
  const [nestAccounts, setNestAccounts] = useState<any[]>([]);
  const [nethomeAccounts, setNetHomeAccounts] = useState<any[]>([]);

  // Form inputs for creating new accounts
  const [cieloApiKey, setCieloApiKey] = useState('');
  const [cieloAccountName, setCieloAccountName] = useState('');
  const [cieloPropertyId, setCieloPropertyId] = useState('');

  const [nestAccessToken, setNestAccessToken] = useState('');
  const [nestRefreshToken, setNestRefreshToken] = useState('');
  const [nestExpiresAt, setNestExpiresAt] = useState('');
  const [nestAccountName, setNestAccountName] = useState('');
  const [nestPropertyId, setNestPropertyId] = useState('');

  const [nethomeApiKey, setNetHomeApiKey] = useState('');
  const [nethomeAccountName, setNetHomeAccountName] = useState('');
  const [nethomePropertyId, setNetHomePropertyId] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load accounts on mount
  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError(null);
        const [cielo, nest, nethome] = await Promise.all([
          api.vendors.cielo.listAccounts(),
          api.vendors.nest.listAccounts(),
          api.vendors.nethome.listAccounts()
        ]);
        setCieloAccounts(cielo);
        setNestAccounts(nest);
        setNetHomeAccounts(nethome);
      } catch (err: any) {
        setError(err.message || 'Failed to load vendor accounts');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [user]);

  // Helpers to refresh accounts after creation
  const refreshCielo = async () => {
    const accounts = await api.vendors.cielo.listAccounts();
    setCieloAccounts(accounts);
  };
  const refreshNest = async () => {
    const accounts = await api.vendors.nest.listAccounts();
    setNestAccounts(accounts);
  };
  const refreshNetHome = async () => {
    const accounts = await api.vendors.nethome.listAccounts();
    setNetHomeAccounts(accounts);
  };

  // Submit handlers
  const handleCieloCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cieloApiKey) {
      setError('Cielo API key is required');
      return;
    }
    try {
      setError(null);
      await api.vendors.cielo.createAccount({
        api_key: cieloApiKey,
        account_name: cieloAccountName || undefined,
        property_id: cieloPropertyId ? Number(cieloPropertyId) : undefined
      });
      setCieloApiKey('');
      setCieloAccountName('');
      setCieloPropertyId('');
      await refreshCielo();
    } catch (err: any) {
      setError(err.message || 'Failed to create Cielo account');
    }
  };

  const handleNestCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nestAccessToken || !nestRefreshToken || !nestExpiresAt) {
      setError('Nest access token, refresh token and expires_at are required');
      return;
    }
    try {
      setError(null);
      await api.vendors.nest.createAccount({
        access_token: nestAccessToken,
        refresh_token: nestRefreshToken,
        expires_at: nestExpiresAt,
        account_name: nestAccountName || undefined,
        property_id: nestPropertyId ? Number(nestPropertyId) : undefined
      });
      setNestAccessToken('');
      setNestRefreshToken('');
      setNestExpiresAt('');
      setNestAccountName('');
      setNestPropertyId('');
      await refreshNest();
    } catch (err: any) {
      setError(err.message || 'Failed to create Nest account');
    }
  };

  const handleNetHomeCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nethomeApiKey) {
      setError('NetHome API key is required');
      return;
    }
    try {
      setError(null);
      await api.vendors.nethome.createAccount({
        api_key: nethomeApiKey,
        account_name: nethomeAccountName || undefined,
        property_id: nethomePropertyId ? Number(nethomePropertyId) : undefined
      });
      setNetHomeApiKey('');
      setNetHomeAccountName('');
      setNetHomePropertyId('');
      await refreshNetHome();
    } catch (err: any) {
      setError(err.message || 'Failed to create NetHome account');
    }
  };

  // If user is not admin show 403
  if (!user || user.role !== 'admin') {
    return (
      <AppLayout>
        <div className="py-10">
          <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
          <p>You do not have permission to view this page.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="py-10">
        <h1 className="text-3xl font-bold mb-6">Vendor Accounts</h1>
        {loading && <p>Loading vendor accounts...</p>}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {/* Cielo Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Cielo</h2>
          <ul className="mb-4 list-disc list-inside">
            {cieloAccounts.length > 0 ? (
              cieloAccounts.map((account) => (
                <li key={account.id}>
                  {account.account_name || 'Unnamed'} (ID: {account.id}) {account.property_id ? `- Property ${account.property_id}` : '- Global'}
                </li>
              ))
            ) : (
              <li>No Cielo accounts found.</li>
            )}
          </ul>
          <form onSubmit={handleCieloCreate} className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">API Key<span className="text-red-500">*</span></label>
              <input
                type="text"
                value={cieloApiKey}
                onChange={(e) => setCieloApiKey(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2"
                placeholder="Enter Cielo API key"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Name</label>
              <input
                type="text"
                value={cieloAccountName}
                onChange={(e) => setCieloAccountName(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2"
                placeholder="Optional name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Property ID</label>
              <input
                type="number"
                value={cieloPropertyId}
                onChange={(e) => setCieloPropertyId(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2"
                placeholder="Optional property ID"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Create Cielo Account
            </button>
          </form>
        </section>
        {/* Nest Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Nest</h2>
          <ul className="mb-4 list-disc list-inside">
            {nestAccounts.length > 0 ? (
              nestAccounts.map((account) => (
                <li key={account.id}>
                  {account.account_name || 'Unnamed'} (ID: {account.id}) {account.property_id ? `- Property ${account.property_id}` : '- Global'}
                  {account.expires_at && ` - Expires ${new Date(account.expires_at).toLocaleString()}`}
                </li>
              ))
            ) : (
              <li>No Nest accounts found.</li>
            )}
          </ul>
          <form onSubmit={handleNestCreate} className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Access Token<span className="text-red-500">*</span></label>
              <input
                type="text"
                value={nestAccessToken}
                onChange={(e) => setNestAccessToken(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2"
                placeholder="Nest access token"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Refresh Token<span className="text-red-500">*</span></label>
              <input
                type="text"
                value={nestRefreshToken}
                onChange={(e) => setNestRefreshToken(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2"
                placeholder="Nest refresh token"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expires At (ISO8601)<span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                value={nestExpiresAt}
                onChange={(e) => setNestExpiresAt(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Name</label>
              <input
                type="text"
                value={nestAccountName}
                onChange={(e) => setNestAccountName(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2"
                placeholder="Optional name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Property ID</label>
              <input
                type="number"
                value={nestPropertyId}
                onChange={(e) => setNestPropertyId(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2"
                placeholder="Optional property ID"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Create Nest Account
            </button>
          </form>
        </section>
        {/* NetHome Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">NetHome / Pioneer</h2>
          <ul className="mb-4 list-disc list-inside">
            {nethomeAccounts.length > 0 ? (
              nethomeAccounts.map((account) => (
                <li key={account.id}>
                  {account.account_name || 'Unnamed'} (ID: {account.id}) {account.property_id ? `- Property ${account.property_id}` : '- Global'}
                </li>
              ))
            ) : (
              <li>No NetHome accounts found.</li>
            )}
          </ul>
          <form onSubmit={handleNetHomeCreate} className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">API Key<span className="text-red-500">*</span></label>
              <input
                type="text"
                value={nethomeApiKey}
                onChange={(e) => setNetHomeApiKey(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2"
                placeholder="Enter NetHome API key"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Name</label>
              <input
                type="text"
                value={nethomeAccountName}
                onChange={(e) => setNetHomeAccountName(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2"
                placeholder="Optional name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Property ID</label>
              <input
                type="number"
                value={nethomePropertyId}
                onChange={(e) => setNetHomePropertyId(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2"
                placeholder="Optional property ID"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Create NetHome Account
            </button>
          </form>
        </section>
      </div>
    </AppLayout>
  );
};

export default VendorsPage;