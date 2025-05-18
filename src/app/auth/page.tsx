'use client';

import { useState } from 'react';
import { supabase, signUp, signIn } from '@/utils/supabase/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    const { error } = isRegistering
      ? await signUp(email, password, fullName)
      : await signIn(email, password);

    if (error) {
      alert(error.message + ": Please check your email and password, or Register if you haven't made an account yet.");
    } else {
      if (isRegistering) {
        alert('Registration successful! Please check your email for confirmation to be able to use the app.');
      } else {
        router.push('/generate');
      }
    }
  };

  const handleForgotPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) alert(error.message);
    else alert('Password reset link sent!');
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-3xl font-semibold mb-4">{isRegistering ? 'Register' : 'Sign In'}</h2>
      <div className="w-full max-w-sm space-y-4">
        {isRegistering && (
          <Input 
            type="text" 
            placeholder="Full Name" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}
        <Input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleAuth} className="w-full bg-purple-600 hover:bg-purple-700">
          {isRegistering ? 'Register' : 'Sign In'}
        </Button>
        <p className="text-sm text-gray-600">
          {isRegistering ? 'Already have an account?' : 'New here?'}{' '}
          <span
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-purple-600 cursor-pointer hover:underline"
          >
            {isRegistering ? 'Sign In' : 'Register'}
          </span>
        </p>
        {!isRegistering && (
          <p className="text-sm text-purple-600 cursor-pointer hover:underline" onClick={handleForgotPassword}>
            Forgot password?
          </p>
        )}
      </div>
    </div>
  );
}
