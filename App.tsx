// src/App.tsx
// REPLACE THE ENTIRE FILE WITH THIS CODE

import { useState, useEffect } from 'react';
import { ApiService, getToken } from './services/apiService';
import { StorageService } from './services/storageService';
import { UserProfile } from './types';
import Workspace from './components/Workspace';
import { SettingsWidget } from './components/WidgetRegistry';

type WorkspaceName = 'Dashboard' | 'Finance' | 'Journal' | 'Habits' | 'Insights' | 'Settings';

const App = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceName>('Dashboard');
  const [theme, setTheme] = useState(StorageService.getTheme());
  
  // Auth state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await ApiService.getProfile();
          setUser(response.user);
          await StorageService.initializeFromBackend();
          const savedTheme = response.user.theme || StorageService.getTheme();
          applyTheme(savedTheme);
        } catch (error) {
          console.error('Session invalid:', error);
          ApiService.logout();
        }
      }
      setInitializing(false);
    };
    
    checkAuth();
  }, []);

  // Apply theme
  const applyTheme = (themeName: string) => {
    setTheme(themeName);
    StorageService.setTheme(themeName);
    
    const themes: Record<string, { bg: string; primary: string; secondary: string; accent: string }> = {
      dracula: { bg: '#1a1a2e', primary: '#0f3460', secondary: '#16213e', accent: '#e94560' },
      aura: { bg: '#0a0e27', primary: '#1a1f3a', secondary: '#2e3856', accent: '#a277ff' },
      memento: { bg: '#1c1c1c', primary: '#2d2d2d', secondary: '#3d3d3d', accent: '#d4af37' },
      tokyo: { bg: '#1a1b26', primary: '#24283b', secondary: '#414868', accent: '#7aa2f7' }
    };

    const t = themes[themeName] || themes.dracula;
    document.documentElement.style.setProperty('--bg', t.bg);
    document.documentElement.style.setProperty('--primary', t.primary);
    document.documentElement.style.setProperty('--secondary', t.secondary);
    document.documentElement.style.setProperty('--accent', t.accent);
  };

  // Handle authentication
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        const response = await ApiService.login(authEmail, authPass);
        setUser(response.user);
        await StorageService.initializeFromBackend();
        const savedTheme = response.user.theme || 'dracula';
        applyTheme(savedTheme);
      } else {
        const response = await ApiService.register(authName, authEmail, authPass);
        setUser(response.user);
        applyTheme('dracula');
      }
    } catch (error: any) {
      setAuthError(error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    StorageService.logout();
    setUser(null);
    setCurrentWorkspace('Dashboard');
    setAuthEmail('');
    setAuthPass('');
    setAuthName('');
    setAuthError('');
  };

  // Update theme (called from Settings widget)
  const handleThemeChange = (newTheme: string) => {
    applyTheme(newTheme);
  };

  // Loading screen
  if (initializing) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
          <div>Loading NEMESIS...</div>
        </div>
      </div>
    );
  }

  // Login/Register screen
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ 
          background: 'var(--primary)', 
          padding: '2rem', 
          borderRadius: '8px', 
          width: '90%', 
          maxWidth: '400px',
          border: '1px solid var(--secondary)'
        }}>
          <h1 style={{ color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>
            ⚡ NEMESIS
          </h1>
          
          <form onSubmit={handleAuth}>
            {authMode === 'register' && (
              <input
                type="text"
                placeholder="Full Name"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  background: 'var(--secondary)',
                  border: '1px solid var(--accent)',
                  borderRadius: '4px',
                  color: 'white'
                }}
              />
            )}
            
            <input
              type="email"
              placeholder="Email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                background: 'var(--secondary)',
                border: '1px solid var(--accent)',
                borderRadius: '4px',
                color: 'white'
              }}
            />
            
            <input
              type="password"
              placeholder="Password"
              value={authPass}
              onChange={(e) => setAuthPass(e.target.value)}
              required
              minLength={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                background: 'var(--secondary)',
                border: '1px solid var(--accent)',
                borderRadius: '4px',
                color: 'white'
              }}
            />

            {authError && (
              <div style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--accent)',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                fontWeight: 'bold',
                cursor: authLoading ? 'not-allowed' : 'pointer',
                opacity: authLoading ? 0.7 : 1
              }}
            >
              {authLoading ? 'Please wait...' : (authMode === 'login' ? 'Login' : 'Create Account')}
            </button>
          </form>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setAuthError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {authMode === 'login' ? 'New User? Register' : 'Have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main app
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'white' }}>
      {/* Header */}
      <header style={{ 
        background: 'var(--primary)', 
        padding: '1rem 2rem', 
        borderBottom: '2px solid var(--accent)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>⚡ NEMESIS</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>
            {user.name || user.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'var(--secondary)',
              border: '1px solid var(--accent)',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Workspace Navigation */}
      <nav style={{ 
        background: 'var(--secondary)', 
        padding: '0.5rem 2rem',
        display: 'flex',
        gap: '1rem',
        overflowX: 'auto'
      }}>
        {(['Dashboard', 'Finance', 'Journal', 'Habits', 'Insights', 'Settings'] as WorkspaceName[]).map(ws => (
          <button
            key={ws}
            onClick={() => setCurrentWorkspace(ws)}
            style={{
              background: currentWorkspace === ws ? 'var(--accent)' : 'transparent',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {ws}
          </button>
        ))}
      </nav>

      {/* Workspace Content */}
      <main style={{ padding: '2rem' }}>
        <Workspace 
          name={currentWorkspace}
          widgets={WidgetRegistry[currentWorkspace] || []}
          onThemeChange={handleThemeChange}
        />
      </main>
    </div>
  );
};

export default App;