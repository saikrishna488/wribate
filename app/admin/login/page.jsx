// app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAtom } from 'jotai';
import { userAtom } from '@/app/states/globalstates';


export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [user,setUser] = useAtom(userAtom);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {

            if(!email || password.length<6){
                toast.error("Enter email and password");
                toast.error("Password length should be atleast 6 digits");

                return
            }

            const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL+'/slogin',{
                email,password
            },{
                headers:{
                    "Content-Type": "application/json"
                },
                withCredentials: true
            },
        )

            const data = res.data;

            // For demo purposes - remove in production
            if (data.res) {
                setUser(data.user)
                router.push('/admin/');
                toast.success("Welcome "+ data.user.name)
            }
        } catch (err) {
            toast.error("Invalid Credentials")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className=" min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold">Admin Portal</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to access the dashboard</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>
                            Enter your credentials to access the admin dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                            href="/admin/forgot-password"
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="remember" />
                                    <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Remember me
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-blue-800"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign in'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t pt-6">
                        <p className="text-sm text-gray-500">
                            Not an administrator?{' '}
                            <Link href="/" className="font-medium text-primary hover:underline">
                                Return to website
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}