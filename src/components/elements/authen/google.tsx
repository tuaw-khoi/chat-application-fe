"use client";
import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firbase/firebase';
import { Button } from '@/components/ui/button';

const Google = () => {
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser(user);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div   className="flex bg-blue-600 hover:bg-blue-800 text-white">
        <img className='w-[40px] px-5' src="src\components\config\asset\Google.png" alt="" />
      <Button 
       
        onClick={handleGoogleSignIn}
      >
        Sign in with Google
      </Button></div>
      {error && (
        <p className="mt-2 text-red-500">
          Error: {error}
        </p>
      )}
      {user && (
        <p className="mt-2 text-green-500">
          Welcome, {user.displayName}
        </p>
      )}
    </div>
  );
};

export default Google;
