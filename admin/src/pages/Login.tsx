import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001/api' : '/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        // Assume backend returns token and user object
        const { token, user } = response.data;
        login(token, user);
        
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid email or password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 text-zinc-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-zinc-900 p-8 shadow-2xl border border-zinc-800">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            <span className="text-[#c5a059]">AIVA</span> ENTERPRISES
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Sign in to your admin dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-zinc-300">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-[#c5a059]"
                placeholder="admin@aivaenterprises.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-[#c5a059]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-[#c5a059] focus:ring-[#c5a059]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-[#c5a059] hover:text-[#b38b45]">
                Forgot password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#c5a059] text-zinc-950 hover:bg-[#b38b45]"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
