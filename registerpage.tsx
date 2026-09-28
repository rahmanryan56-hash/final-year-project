import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { validateEmail, validatePassword, validatePasswordMatch, validateFullName } from '../utils/validation';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    let error = '';
    if (touched[field as keyof typeof touched]) {
      if (field === 'fullName') {
        const validation = validateFullName(value);
        error = validation.error || '';
      } else if (field === 'email') {
        const validation = validateEmail(value);
        error = validation.error || '';
      } else if (field === 'password') {
        const validation = validatePassword(value);
        error = validation.error || '';
      } else if (field === 'confirmPassword') {
        const validation = validatePasswordMatch(formData.password, value);
        error = validation.error || '';
      }
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on blur
    let error = '';
    if (field === 'fullName') {
      const validation = validateFullName(formData.fullName);
      error = validation.error || '';
    } else if (field === 'email') {
      const validation = validateEmail(formData.email);
      error = validation.error || '';
    } else if (field === 'password') {
      const validation = validatePassword(formData.password);
      error = validation.error || '';
    } else if (field === 'confirmPassword') {
      const validation = validatePasswordMatch(formData.password, formData.confirmPassword);
      error = validation.error || '';
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    const nameValidation = validateFullName(formData.fullName);
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);
    const confirmPasswordValidation = validatePasswordMatch(formData.password, formData.confirmPassword);

    const newErrors = {
      fullName: nameValidation.error || '',
      email: emailValidation.error || '',
      password: passwordValidation.error || '',
      confirmPassword: confirmPasswordValidation.error || '',
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    // Simulate registration
    setIsSubmitting(true);
    setTimeout(() => {
      // Store email for verification page
      localStorage.setItem('registrationEmail', formData.email);
      navigate('/verify-email');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header showAuth />

      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#6B1E3E] rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              Register with your University of Westminster email
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className={`pl-10 ${errors.fullName && touched.fullName ? 'border-red-500' : ''}`}
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                  />
                </div>
                {errors.fullName && touched.fullName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">University Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.name@my.westminster.ac.uk"
                    className={`pl-10 ${errors.email && touched.email ? 'border-red-500' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
                {!errors.email && touched.email && formData.email && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Valid university email
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    className={`pl-10 ${errors.password && touched.password ? 'border-red-500' : ''}`}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                  />
                </div>
                {errors.password && touched.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    className={`pl-10 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}`}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword}
                  </p>
                )}
                {!errors.confirmPassword && touched.confirmPassword && formData.confirmPassword && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Passwords match
                  </p>
                )}
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  By registering, you agree to maintain academic integrity and follow the University of Westminster's code of conduct.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full bg-[#6B1E3E] hover:bg-[#5A1833]"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Register'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-[#6B1E3E] hover:underline font-semibold">
                  Login here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
