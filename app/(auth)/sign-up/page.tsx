// 'use client'

// import { useSignUp } from '@clerk/nextjs'
// import { useRouter } from 'next/navigation'
// import React, { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Eye, EyeOff } from 'lucide-react'
// import { Label } from '@/components/ui/label'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import Link from 'next/link'

// export default function SignUp() {
//     const {isLoaded, signUp, setActive} = useSignUp()
//     // const [firstName, setFirstName] = useState("")
//     // const [lastName, setLastName] = useState("")
//     const [emailAddress, setEmailAddress] = useState("")
//     const [password, setPassword] = useState("")
//     const [pendingVerification, setPendingVerification] = useState(false)
//     const [code, setCode] = useState("")
//     const [error, setError] = useState("")
//     const [showPassword, setShowPassword] = useState(false)

//     const router = useRouter()

//     if(!isLoaded){
//         return null;
//     }

//     async function submit(e: React.FormEvent){
//         e.preventDefault()
//         if(!isLoaded) {
//             return;
//         }

//         try {
//             await signUp.create({
//                 // firstName,
//                 // lastName,
//                 emailAddress,
//                 password
//             })

//             await signUp.prepareEmailAddressVerification({
//                 strategy: "email_code"
//             });
//             setPendingVerification(true)
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         } catch (error: any) {
//             console.log(JSON.stringify(error, null, 2));
//             setError(error.errors[0].message)
//         }
//     }

//     async function onPressVerify(e: React.FormEvent) {
//         e.preventDefault()
//         if(!isLoaded) {
//             return
//         }

//         try {
//            const completeSignUp = await signUp.attemptEmailAddressVerification({
//                 code
//             })

//             if (completeSignUp.status !== "complete") {
//                 console.log(JSON.stringify(completeSignUp, null, 2))
//             }

//             if (completeSignUp.status === "complete") {
//                 await setActive({session: completeSignUp.createdSessionId})
//                 router.push('/chat')
//             }
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         } catch (error: any) {
//             console.log(JSON.stringify(error, null, 2))
//             setError(error.errors[0].message)
//         }
//     }

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-background">
//             <Card className="w-full max-w-md">
//                 <CardHeader>
//                     <CardTitle className='text-2xl font-bold text-center'>Sign up for HayCal</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     {!pendingVerification ? (
//                         <form onSubmit={submit} className='space-y-4'>
//                             {/* <div className="space-y-2">
//                                 <Label htmlFor='text' >First Naame</Label>
//                                 <Input type='text' id='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor='text' >Last Naame</Label>
//                                 <Input type='text' id='text' value={lastName} onChange={(e) => setLastName(e.target.value)} required />
//                             </div> */}
//                             <div className="space-y-2">
//                                 <Label htmlFor='email' >Email Address</Label>
//                                 <Input type='email' id='email' value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} required />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor='password' >Password</Label>
//                                 <div className="relative">
//                                     <Input type={showPassword ? 'text' : 'password'} id='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
//                                     <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-2 top-1/2 -translate-y-1/2'>
//                                         {showPassword ? (
//                                             <EyeOff className='h-4 w-4 text-gray-500' />
//                                         ) : (
//                                             <Eye className='h-4 w-4 text-gray-500' />
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>
//                             {error && (
//                                 <Alert variant='destructive'>
//                                     <AlertDescription>{error}</AlertDescription>
//                                 </Alert>
//                             )}
//                             <Button type='submit' className='w-full'>Create Account</Button>
//                         </form>
//                     ) : (
//                         <form onSubmit={onPressVerify} className="space-y-4">
//                             <div className="space-y-2">
//                                 <Label  htmlFor='code'>Verification Code</Label>
//                                 <Input id='code' value={code} onChange={(e) => setCode(e.target.value)} placeholder='Enter verification code' required />
//                             </div>
//                             {error && (
//                                 <Alert variant="destructive">
//                                     <AlertDescription>{error}</AlertDescription>
//                                 </Alert>
//                             )}
//                             <Button type='submit' className='w-full'>Verify Email</Button>
//                         </form>
//                     )}
//                 </CardContent>
//                 <CardFooter className='justify-content'>
//                     <p className="text-sm text-muted-foreground">
//                         Already have an account?{" "}
//                         <Link href='/sign-in' className='font-medium text-primary hover:underline'>Sign in</Link>
//                     </p>
//                 </CardFooter>
//             </Card>
//         </div>
//     )
// }

'use client'

import { useSignUp, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { redirectToSignUp } = useClerk();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isLoaded) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!signUp) {
        setError('Sign up is not available. Please try again later.');
        return;
      }
      await signUp.create({ firstName, lastName, emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (error: any) {
      setError(error.errors?.[0]?.message || 'Something went wrong');
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!signUp) {
        setError('Sign up is not available. Please try again later.');
        return;
      }
      const complete = await signUp.attemptEmailAddressVerification({ code });
      if (complete.status === 'complete') {
        await setActive({ session: complete.createdSessionId });
        router.push('/chat');
      }
    } catch (error: any) {
      setError(error.errors?.[0]?.message || 'Invalid code');
    }
  }

  const handleGoogleSignup = () => {
    // Redirect to sign-up page, where social providers are configured via Clerk dashboard
    redirectToSignUp({ redirectUrl: '/chat' });
  };

  return (
    <div className="bg-gray-100 font-['Plus_Jakarta_Sans'] min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Left Column: Sign-up Form */}
          <div className="md:w-3/5 p-8 flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
              <p className="text-gray-500 mt-2">Start scheduling your life with HeyCal</p>
            </div>

            {!pendingVerification ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center"
                >
                  <span>Create Account</span>
                </button>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={handleVerify}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter verification code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center"
                >
                  <span>Verify Email</span>
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center space-x-4">
              <button
                onClick={handleGoogleSignup}
                className="flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <i className="fa-brands fa-google text-red-500 mr-2"></i>
                <span className="text-sm text-gray-700">Google</span>
              </button>

              <button
                disabled
                className="flex items-center px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
              >
                <i className="fa-brands fa-github text-gray-500 mr-2"></i>
                <span className="text-sm">GitHub</span>
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:w-2/5 bg-gray-50 p-8 border-l border-gray-200 flex flex-col items-center justify-center text-center">
            <div className="mb-6">
              <img
                src="https://aurachat.io/logo-aura.svg"
                alt="AuraChat Logo"
                className="w-32 h-32 mx-auto filter invert"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome to HeyCal</h3>
            <p className="text-gray-500 mb-4">Plan, reschedule, and talk to your calendar effortlessly.</p>
            <div className="flex items-center justify-center space-x-3 mt-6">
              <i className="fa-solid fa-shield-halved text-indigo-500 text-xl"></i>
              <span className="text-xs text-gray-500">Your data is encrypted and secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
