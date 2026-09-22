import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/lib/axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('Aivaenterprises11@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post(`/auth/login`, {
        email: email.trim(),
        password
      });

      if (response.data.success) {
        const { token, user } = response.data;
        login(token, user);
        
        toast({
          title: "Welcome back!",
          description: `Logged in as ${user.name || 'Admin'}.`,
        });
        
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.response?.data?.message || "Invalid email or password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 text-zinc-50 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 rounded-2xl bg-zinc-900/90 backdrop-blur-xl p-8 shadow-2xl border border-zinc-800 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700/70 shadow-inner mb-2">
            <ShieldCheck className="h-7 w-7 text-[#c5a059]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            <span className="text-[#c5a059]">AIVA</span> ENTERPRISES
          </h2>
          <p className="text-xs text-zinc-400">
            Sign in to access the Admin Management Portal
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-zinc-300">Admin Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 bg-zinc-800/80 border-zinc-700 text-white placeholder:text-zinc-500 text-xs focus-visible:ring-[#c5a059] h-10"
                  placeholder="Aivaenterprises11@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-zinc-300">Password</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="pl-10 pr-10 bg-zinc-800/80 border-zinc-700 text-white placeholder:text-zinc-500 text-xs focus-visible:ring-[#c5a059] h-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#c5a059] text-zinc-950 hover:bg-[#b38b45] font-semibold h-10 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer info */}
        <div className="pt-4 border-t border-zinc-800/80 text-center">
          <p className="text-[11px] text-zinc-500">
            AIVA Enterprises Internal Administration System
          </p>
        </div>
      </div>
    </div>
  );
}
