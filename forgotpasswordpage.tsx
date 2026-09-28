import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { validateEmail } from '../utils/validation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setError(emailValidation.error || 'Invalid email');
      return;
    }

    setIsSubmitting(true);

    // Simulate sending reset email
    setTimeout(() => {
      setIsSubmitting(false);
      setEmailSent(true);
    }, 1500);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header showAuth />

        <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>
                We've sent a password reset link to your email
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <Mail className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  A password reset link has been sent to <strong>{email}</strong>
                </AlertDescription>
              </Alert>

              <div className="text-sm text-gray-600 space-y-2">
                <p>Please check your inbox and click the link to reset your password.</p>
                <p>If you don't see the email, check your spam folder.</p>
              </div>

              <div className="space-y-3 pt-4">
                <Link to="/reset-password">
                  <Button className="w-full bg-[#6B1E3E] hover:bg-[#5A1833]">
                    Continue to Reset Password (Demo)
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Return to Login
                  </Button>
                </Link>
              </div>

              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  className="text-sm text-[#6B1E3E] hover:underline"
                >
                  Try a different email
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header showAuth />

      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#6B1E3E] rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Forgot Password?</CardTitle>
            <CardDescription>
              Enter your university email to receive a password reset link
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">University Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.name@my.westminster.ac.uk"
                    className="pl-10"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-[#6B1E3E] hover:bg-[#5A1833]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center text-sm text-[#6B1E3E] hover:underline">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
