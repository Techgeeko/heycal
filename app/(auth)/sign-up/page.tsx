'use client'

import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function SignUp() {
    const {isLoaded, signUp, setActive} = useSignUp()
    // const [firstName, setFirstName] = useState("")
    // const [lastName, setLastName] = useState("")
    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const router = useRouter()

    if(!isLoaded){
        return null;
    }

    async function submit(e: React.FormEvent){
        e.preventDefault()
        if(!isLoaded) {
            return;
        }

        try {
            await signUp.create({
                // firstName,
                // lastName,
                emailAddress,
                password
            })

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            });
            setPendingVerification(true)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(JSON.stringify(error, null, 2));
            setError(error.errors[0].message)
        }
    }

    async function onPressVerify(e: React.FormEvent) {
        e.preventDefault()
        if(!isLoaded) {
            return
        }

        try {
           const completeSignUp = await signUp.attemptEmailAddressVerification({
                code
            })

            if (completeSignUp.status !== "complete") {
                console.log(JSON.stringify(completeSignUp, null, 2))
            }

            if (completeSignUp.status === "complete") {
                await setActive({session: completeSignUp.createdSessionId})
                router.push('/chat')
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(JSON.stringify(error, null, 2))
            setError(error.errors[0].message)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className='text-2xl font-bold text-center'>Sign up for HayCal</CardTitle>
                </CardHeader>
                <CardContent>
                    {!pendingVerification ? (
                        <form onSubmit={submit} className='space-y-4'>
                            {/* <div className="space-y-2">
                                <Label htmlFor='text' >First Naame</Label>
                                <Input type='text' id='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor='text' >Last Naame</Label>
                                <Input type='text' id='text' value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            </div> */}
                            <div className="space-y-2">
                                <Label htmlFor='email' >Email Address</Label>
                                <Input type='email' id='email' value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor='password' >Password</Label>
                                <div className="relative">
                                    <Input type={showPassword ? 'text' : 'password'} id='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-2 top-1/2 -translate-y-1/2'>
                                        {showPassword ? (
                                            <EyeOff className='h-4 w-4 text-gray-500' />
                                        ) : (
                                            <Eye className='h-4 w-4 text-gray-500' />
                                        )}
                                    </button>
                                </div>
                            </div>
                            {error && (
                                <Alert variant='destructive'>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <Button type='submit' className='w-full'>Create Account</Button>
                        </form>
                    ) : (
                        <form onSubmit={onPressVerify} className="space-y-4">
                            <div className="space-y-2">
                                <Label  htmlFor='code'>Verification Code</Label>
                                <Input id='code' value={code} onChange={(e) => setCode(e.target.value)} placeholder='Enter verification code' required />
                            </div>
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <Button type='submit' className='w-full'>Verify Email</Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className='justify-content'>
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href='/sign-in' className='font-medium text-primary hover:underline'>Sign in</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}