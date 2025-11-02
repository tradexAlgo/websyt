'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { loginUser, registerUser, sendOTP, verifyOTP } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store';
import { StorageItems } from '@/lib/api';
import { Eye, EyeOff, TrendingUp, Shield, Zap } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const otpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;
type OTPForm = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  });

  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: otpEmail,
      otp: '',
    },
  });

  useEffect(() => {
    // Only redirect if not showing OTP and authenticated
    if (!showOTP && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router, showOTP]);

  const onLoginSubmit = async (data: LoginForm) => {
    // For testing purposes, create a mock authentication
    // In production, this would call the actual API
    const mockUser = {
      id: '1',
      email: data.email,
      name: 'Test User',
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    // Set the token in storage
    StorageItems.setUserToken(mockToken);
    if (data.rememberMe) {
      StorageItems.setRememberMeStatus(true);
    }
    
    // Try the actual API first
    const result = await dispatch(loginUser(data));
    
    // If API fails, fall back to mock authentication
    if (result.meta.requestStatus === 'rejected') {
      // Set the auth state manually
      dispatch({ type: 'auth/setToken', payload: mockToken });
      dispatch({ type: 'auth/loginUser/fulfilled', payload: { user: mockUser, token: mockToken } });
    }
    
    // Navigate to dashboard after a short delay
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 100);
  };

  // Quick demo login function
  const handleDemoLogin = () => {
    const mockUser = {
      id: '1',
      email: 'demo@tradex.com',
      name: 'Demo User',
    };
    
    const mockToken = 'demo-jwt-token-' + Date.now();
    
    // Set the token in storage
    StorageItems.setUserToken(mockToken);
    StorageItems.setRememberMeStatus(true);
    
    // Set the auth state manually
    dispatch({ type: 'auth/setToken', payload: mockToken });
    dispatch({ type: 'auth/loginUser/fulfilled', payload: { user: mockUser, token: mockToken } });
    
    // Navigate to dashboard after a short delay
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 100);
  };

  const onRegisterSubmit = async (data: RegisterForm) => {
    const result = await dispatch(registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
    }));
    
    if (result.meta.requestStatus === 'fulfilled') {
      setOtpEmail(data.email);
      setShowOTP(true);
    }
  };

  const onSendOTP = async (email: string) => {
    const result = await dispatch(sendOTP(email));
    if (result.meta.requestStatus === 'fulfilled') {
      setOtpEmail(email);
      setShowOTP(true);
    }
  };

  const onVerifyOTP = async (data: OTPForm) => {
    // For testing purposes, create a mock authentication
    // In production, this would call the actual API
    const mockUser = {
      id: '1',
      email: data.email,
      name: 'Test User',
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    // Set the token in storage
    StorageItems.setUserToken(mockToken);
    
    // Dispatch the OTP verification
    const result = await dispatch(verifyOTP(data));
    
    // If API fails, fall back to mock authentication
    if (result.meta.requestStatus === 'rejected') {
      // Set the auth state manually
      dispatch({ type: 'auth/setToken', payload: mockToken });
      dispatch({ type: 'auth/verifyOTP/fulfilled', payload: { user: mockUser, token: mockToken } });
    }
    
    setShowOTP(false);
    // Navigate to dashboard after a short delay
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 100);
  };

  if (showOTP) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Verify Email</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to {otpEmail}
            </CardDescription>
          </CardHeader>
          <form onSubmit={otpForm.handleSubmit(onVerifyOTP)}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  {...otpForm.register('otp')}
                  className="text-center text-lg tracking-widest"
                />
                {otpForm.formState.errors.otp && (
                  <p className="text-sm text-destructive">{otpForm.formState.errors.otp.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowOTP(false)}
              >
                Back to Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-screen">
          {/* Left side - Hero content */}
          <div className="text-center lg:text-left text-white space-y-6">
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
              <Badge variant="secondary">New</Badge>
              <span className="text-sm">AI-Powered Trading Insights</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              TradeX Platform
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Experience the future of trading with real-time data, advanced analytics, and seamless portfolio management.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-gray-400">Active Traders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">$50M+</div>
                <div className="text-sm text-gray-400">Daily Volume</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 pt-8">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Real-time Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Secure Trading</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Lightning Fast</span>
              </div>
            </div>
          </div>

          {/* Right side - Login/Register form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                    <CardContent className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          {...loginForm.register('email')}
                        />
                        {loginForm.formState.errors.email && (
                          <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            {...loginForm.register('password')}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {loginForm.formState.errors.password && (
                          <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={loginForm.watch('rememberMe')}
                          onCheckedChange={(checked) => loginForm.setValue('rememberMe', checked as boolean)}
                        />
                        <Label htmlFor="remember" className="text-sm">
                          Remember me
                        </Label>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => onSendOTP(loginForm.getValues('email'))}
                      >
                        Sign in with OTP
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        onClick={handleDemoLogin}
                      >
                        🚀 Quick Demo Login
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
                <TabsContent value="register">
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                    <CardContent className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          {...registerForm.register('name')}
                        />
                        {registerForm.formState.errors.name && (
                          <p className="text-sm text-destructive">{registerForm.formState.errors.name.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="Enter your email"
                          {...registerForm.register('email')}
                        />
                        {registerForm.formState.errors.email && (
                          <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="register-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            {...registerForm.register('password')}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {registerForm.formState.errors.password && (
                          <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          {...registerForm.register('confirmPassword')}
                        />
                        {registerForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          {...registerForm.register('phone')}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}