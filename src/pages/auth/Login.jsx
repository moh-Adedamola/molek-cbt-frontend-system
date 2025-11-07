import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Hash } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import { useAuthStore } from '../../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [loginType, setLoginType] = useState('email'); // 'email' or 'exam_number'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-detect if it's an exam number
    if (name === 'identifier' && value.startsWith('EXAM-')) {
      setLoginType('exam_number');
    } else if (name === 'identifier' && value.includes('@')) {
      setLoginType('email');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!formData.identifier || !formData.password) {
      setAlert({
        type: 'error',
        message: 'Please enter your credentials',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Prepare login payload
      const loginPayload = {
        password: formData.password,
      };

      // Add identifier or email based on type
      if (formData.identifier.startsWith('EXAM-')) {
        loginPayload.identifier = formData.identifier;
      } else {
        loginPayload.email = formData.identifier;
        loginPayload.identifier = formData.identifier; // Also add for compatibility
      }

      console.log('🔐 Login attempt:', { ...loginPayload, password: '***' });

      // ✅ FIXED: Only call store's login (no duplicate API call)
      const result = await storeLogin(loginPayload);

      if (result.success) {
        console.log('✅ Login successful');
        
        // Get user from store
        const { user } = useAuthStore.getState();

        // Redirect based on role
        const roleRoutes = {
          admin: '/admin/dashboard',
          teacher: '/teacher/dashboard',
          student: '/student/dashboard',
        };

        const destination = roleRoutes[user.role] || '/';
        console.log('📍 Redirecting to:', destination);
        
        navigate(destination, { replace: true });
      } else {
        setAlert({
          type: 'error',
          message: result.error || 'Login failed. Please try again.',
        });
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setAlert({
        type: 'error',
        message: error.message || 'Login failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
            M
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Molek CBT</h1>
          <p className="mt-2 text-gray-600">Computer-Based Testing System</p>
        </div>

        {/* Login Card */}
        <div className="rounded-lg bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Login</h2>

          {/* Alert */}
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
              className="mb-4"
            />
          )}

          {/* Login Type Toggle */}
          <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setLoginType('email')}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                loginType === 'email'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="mr-2 inline h-4 w-4" />
              Email Login
            </button>
            <button
              type="button"
              onClick={() => setLoginType('exam_number')}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                loginType === 'exam_number'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Hash className="mr-2 inline h-4 w-4" />
              Exam Number
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Identifier Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {loginType === 'exam_number' ? 'Exam Number' : 'Email Address'}
              </label>
              <Input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder={
                  loginType === 'exam_number'
                    ? 'e.g., EXAM-2025-0001'
                    : 'your@email.com'
                }
                icon={loginType === 'exam_number' ? Hash : Mail}
                required
                autoComplete="username"
              />
              {loginType === 'exam_number' && (
                <p className="mt-1 text-xs text-gray-500">
                  Enter your exam number (provided by your school)
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  icon={Lock}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign In
            </Button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              {loginType === 'exam_number' ? (
                <>
                  <AlertCircle className="mr-1 inline h-4 w-4" />
                  Don't have an exam number? Contact your school administrator.
                </>
              ) : (
                <>
                  <AlertCircle className="mr-1 inline h-4 w-4" />
                  Forgot your password? Contact your administrator.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2025 Molek CBT System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;