"use client";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firbase/firebase";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import Cookies from "js-cookie";

const Google = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const resultUser = result.user;
      setUser(resultUser);
      setError(null);
      console.log(user);
      Cookies.set("token", user?.accessToken, {
        secure: true,
        sameSite: "strict",
        expires: 1,
      });
      console.log(user?.accessToken);
      loginWithGoogle.mutate();
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
      <div className="flex items-center justify-center my-auto text-black border rounded-md px-5 mt-2 border-black">
        <img
          className="w-[30px] h-[30px] mr-2"
          src="src/components/config/asset/Google.png"
          alt="Google logo"
        />
        <Button
          className="text-black bg-transparent hover:bg-transparent"
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </Button>
      </div>

      {error && <p className="mt-2 text-red-500">Error: {error}</p>}
    </div>
  );
};

export default Google;
