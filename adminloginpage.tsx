import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { setCurrentUser } from '../utils/mockData';
import { toast } from 'sonner';

// Demo admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@westminster.ac.uk',
  password: 'Admin123!',
  fullName: 'System Administrator',
};

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Check credentials
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        // Set admin user
        const adminUser = {
          id: 'admin-1',
          fullName: ADMIN_CREDENTIALS.fullName,
          email: ADMIN_CREDENTIALS.email,
          role: 'admin' as const,
        };
        
        setCurrentUser(adminUser);
        toast.success('Admin login successful!', {
          description: 'Welcome to the StudyWest Admin Panel',
        });
        navigate('/admin');
      } else {
        setError('Invalid admin credentials. Please check your email and password.');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleDemoLogin = () => {
    setEmail(ADMIN_CREDENTIALS.email);
    setPassword(ADMIN_CREDENTIALS.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-white/80 text-lg">StudyWest Platform Management</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Administrator Login</CardTitle>
            <CardDescription className="text-center">
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="email"
                    placeholder="admin@westminster.ac.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  'Authenticating...'
                ) : (
                  <>
                    Sign In to Admin Panel
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials</p>
                  <div className="space-y-1 text-xs text-blue-800 font-mono bg-white p-2 rounded">
                    <p><strong>Email:</strong> {ADMIN_CREDENTIALS.email}</p>
                    <p><strong>Password:</strong> {ADMIN_CREDENTIALS.password}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full text-blue-700 border-blue-300 hover:bg-blue-100"
                    onClick={handleDemoLogin}
                  >
                    Use Demo Credentials
                  </Button>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Security Notice:</strong> Admin access is restricted to authorized personnel only. 
                All actions are logged and monitored for security purposes.
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-purple-600 hover:text-purple-700 hover:underline">
                ← Back to Student Portal
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-center text-white/70 text-sm">
          <p>University of Westminster</p>
          <p className="mt-1">StudyWest Platform © 2026</p>
        </div>
      </div>
    </div>
  );
}
