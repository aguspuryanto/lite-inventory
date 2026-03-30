import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet } from 'lucide-react';
import { useStore, Role } from '../store';

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('STAFF');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const { login, register, resetPassword } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'login') {
      const success = login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Username atau password salah.');
      }
    } else if (mode === 'register') {
      const success = register(username, password, role);
      if (success) {
        setSuccess('Registrasi berhasil! Silakan login.');
        setMode('login');
        setPassword('');
      } else {
        setError('Username sudah digunakan.');
      }
    } else if (mode === 'reset') {
      const success = resetPassword(username, password);
      if (success) {
        setSuccess('Password berhasil direset! Silakan login.');
        setMode('login');
        setPassword('');
      } else {
        setError('Username tidak ditemukan.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Droplet className="w-12 h-12 text-primary" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          Essential Oil Inventory
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === 'login' && 'Masuk ke akun Anda'}
          {mode === 'register' && 'Daftar akun baru'}
          {mode === 'reset' && 'Reset password Anda'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card border border-border py-8 px-4 shadow-sm sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Username
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border bg-background text-foreground rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">
                {mode === 'reset' ? 'Password Baru' : 'Password'}
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border bg-background text-foreground rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Peran (Role)
                </label>
                <div className="mt-1">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="block w-full px-3 py-2 border border-border bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  >
                    <option value="STAFF">Staf Gudang</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
            )}

            {error && <div className="text-destructive text-sm text-center">{error}</div>}
            {success && <div className="text-emerald-600 dark:text-emerald-400 text-sm text-center">{success}</div>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {mode === 'login' && 'Sign in'}
                {mode === 'register' && 'Daftar'}
                {mode === 'reset' && 'Reset Password'}
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-col items-center space-y-2 text-sm">
            {mode !== 'login' && (
              <button onClick={() => setMode('login')} className="text-primary hover:text-primary/80 font-medium">
                Kembali ke Login
              </button>
            )}
            {mode === 'login' && (
              <>
                <button onClick={() => setMode('register')} className="text-primary hover:text-primary/80 font-medium">
                  Belum punya akun? Daftar
                </button>
                <button onClick={() => setMode('reset')} className="text-muted-foreground hover:text-foreground">
                  Lupa password?
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
