"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, User, Mail, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/signup", {
        username,
        email: emailAddress,
        password,
      });
      toast.success("Signed up successfully!");
      router.push("/feed");
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
        toast.error(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google") => {
    setLoading(true);
    await import("next-auth/react").then(({ signIn }) =>
      signIn(provider, { callbackUrl: "/feed" })
    );
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a1e] text-white font-mono">
      <Card className="w-full max-w-md shadow-lg bg-[#121215] border border-[#23232b]">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-3xl font-extrabold text-white font-serif">
            Sign Up for StackIt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-[#1f1f22] hover:bg-zinc-200 text-white border border-[#3a3a47] transition-colors p-5 text-md"
            onClick={() => handleOAuthSignIn("google")}
            disabled={loading}
          >
            <svg
              className="w-10 h-10"
              viewBox="0 0 533.5 544.3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285f4"
                d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.4H272v95.3h146.9c-6.3 33.4-25 61.6-53.3 80.5l86.2 67.1c50.3-46.4 81.7-114.8 81.7-192.5z"
              />
              <path
                fill="#34a853"
                d="M272 544.3c72.6 0 133.6-24 178.1-65.2l-86.2-67.1c-23.9 16.1-54.4 25.6-91.9 25.6-70.7 0-130.7-47.7-152.1-111.4H32.7v69.9C77.6 475.6 168.9 544.3 272 544.3z"
              />
              <path
                fill="#fbbc04"
                d="M119.9 325.6c-10.2-30.2-10.2-62.7 0-92.9V162.8H32.7c-29.3 58.5-29.3 127.5 0 186z"
              />
              <path
                fill="#ea4335"
                d="M272 107.7c39.5-.6 77.4 13.4 106.2 39.6l79.3-79.3C409.4 23 342.6-1.5 272 0 168.9 0 77.6 68.7 32.7 162.8l87.2 69.9C141.3 155.3 201.3 107.7 272 107.7z"
              />
            </svg>
            Sign up with Google
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#23232b]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#18181b] px-2 text-muted-foreground">
                or continue with email
              </span>
            </div>
          </div>
        </CardContent>
        <form onSubmit={handleSubmit} autoComplete="off">
          <CardContent className="space-y-4">
            {error && (
              <Alert
                variant="destructive"
                className="bg-[#2a1a1a] border-red-900"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div>
              <Label
                htmlFor="username"
                className="mb-2 text-white font-semibold"
              >
                Username
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  className="pl-10 bg-[#23232b] text-white border-[#333] placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                />
                <User className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 text-white font-semibold">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                  className="pl-10 bg-[#23232b] text-white border-[#333] placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                />
                <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <Label
                htmlFor="password"
                className="mb-2 text-white font-semibold"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10 bg-[#23232b] text-white border-[#333] placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                />
                <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 mt-5">
            <Button
              type="submit"
              className="w-fit py-5 mt-2 bg-zinc-100 hover:bg-zinc-200 border border-[#444] text-black font-semibold transition-colors duration-200 shadow-sm text-md"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : ""}
              Sign Up
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/signin" className="underline hover:text-white">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
