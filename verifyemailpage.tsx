import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Mail, AlertCircle, CheckCircle, Copy, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { generateVerificationCode } from '../utils/validation';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const registrationEmail = localStorage.getItem('registrationEmail');
    if (!registrationEmail) {
      navigate('/register');
      return;
    }
    setEmail(registrationEmail);
  }, [navigate]);

  const handleGenerateCode = () => {
    const newCode = generateVerificationCode();
    setGeneratedCode(newCode);
    setShowCodePopup(true);
    toast.success('Verification code generated!');
  };

  const handleCopyCode = () => {
    if (!generatedCode) {
      toast.error('No code to copy');
      return;
    }

    // Create a temporary input element
    const textArea = document.createElement('textarea');
    textArea.value = generatedCode;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        toast.success('Code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } else {
        // If execCommand fails, try clipboard API
        navigator.clipboard.writeText(generatedCode).then(() => {
          setCopied(true);
          toast.success('Code copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
          toast.info(`Code: ${generatedCode} (manually copy this)`);
        });
      }
    } catch (err) {
      document.body.removeChild(textArea);
      // Try clipboard API as fallback
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(generatedCode).then(() => {
          setCopied(true);
          toast.success('Code copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
          toast.info(`Code: ${generatedCode} (manually copy this)`);
        });
      } else {
        toast.info(`Code: ${generatedCode} (manually copy this)`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code) {
      setError('Please enter the verification code');
      return;
    }

    if (code.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

    if (!generatedCode) {
      setError('Please generate a verification code first');
      return;
    }

    if (code !== generatedCode) {
      setError('Invalid verification code. Please check and try again.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.removeItem('registrationEmail');
      toast.success('Email verified successfully!');
      navigate('/login');
    }, 1000);
  };

  const handleResendCode = () => {
    const newCode = generateVerificationCode();
    setGeneratedCode(newCode);
    setShowCodePopup(true);
    setCode('');
    setError('');
    toast.success('New verification code generated!');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#6B1E3E] rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              We need to verify your email address
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Alert className="mb-6">
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Email will be sent to: <strong>{email}</strong>
              </AlertDescription>
            </Alert>

            <div className="mb-6">
              <Button
                onClick={handleGenerateCode}
                className="w-full bg-[#6B1E3E] hover:bg-[#5A1833]"
                type="button"
              >
                Generate Verification Code
              </Button>
              <p className="text-sm text-gray-500 text-center mt-2">
                Click to generate a 6-digit verification code
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className={`text-center text-2xl tracking-widest ${error ? 'border-red-500' : ''}`}
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setCode(value);
                    setError('');
                  }}
                />
                {error && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#6B1E3E] hover:bg-[#5A1833]"
                disabled={isSubmitting || !code}
              >
                {isSubmitting ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendCode}
                  className="text-[#6B1E3E] hover:underline font-semibold"
                  type="button"
                >
                  Generate new code
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Code Popup */}
      <Dialog open={showCodePopup} onOpenChange={setShowCodePopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Verification Code Generated
            </DialogTitle>
            <DialogDescription>
              Copy this code and paste it in the verification field
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-100 p-6 rounded-lg border-2 border-[#6B1E3E] border-dashed">
              <p className="text-center text-4xl font-bold tracking-widest text-[#6B1E3E] mb-2">
                {generatedCode}
              </p>
              <p className="text-center text-sm text-gray-500">
                This is your 6-digit verification code
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCopyCode}
                className="flex-1 bg-[#6B1E3E] hover:bg-[#5A1833]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowCodePopup(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>

            <Alert>
              <AlertDescription className="text-xs">
                In a real application, this code would be sent to your email. 
                For this demo, use the code shown above to verify your account.
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
