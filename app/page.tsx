'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* <SignedOut>
        <LandingPage />
      </SignedOut> */}
      {/* <SignedIn> */}
      <div className='flex items-center justify-center min-h-screen'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <CardTitle className='font-sans'>
              Bem vindo, to Projeta Plus!
            </CardTitle>
            <CardDescription className='font-serif'>
              Your SaaS billing dashboard is ready
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-center'>
              {/* <UserButton afterSignOutUrl='/' /> */}
            </div>
            <Link href='/dashboard'>
              <Button className='w-full' size='lg'>
                Go to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      {/* </SignedIn> */}
    </div>
  );
}

// function LandingPage() {
//   return (
//     <div className='flex flex-col min-h-screen'>
//       {/* Header */}
//       <header className='border-b bg-card'>
//         <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
//           <div className='flex items-center space-x-2 w-full'>
//             <HousePlus className='h-6 w-6 mt-1 font-bold text-primary' />
//             <h1 className='text-xl font-bold font-sans flex mt-2'>
//               Projeta <Plus className='h-4 w-4 mt-1 font-bold text-primary' />
//             </h1>
//           </div>
//           {/* <SignInButton mode='modal'>
//             <Button variant='outline'>Sign In</Button>
//           </SignInButton>
//           <ThemeToggleButton /> */}
//         </div>
//       </header>

//       {/* Hero Section */}
//       <main className='flex-1'>
//         <section className='py-20 px-4'>
//           <div className='container mx-auto text-center max-w-4xl'>
//             <h2 className='text-5xl font-bold font-sans mb-6 text-foreground'>
//               Projeta
//               <span className='text-primary'> Plus</span>
//             </h2>
//             <p className='text-xl font-serif text-muted-foreground mb-8 leading-relaxed'>
//               Launch your SaaS with professional billing in minutes. Clerk
//               authentication meets Stripe payments in a beautiful, ready-to-use
//               dashboard.
//             </p>
//             <div className='flex flex-col sm:flex-row gap-4 justify-center'>
//               {/* <SignInButton mode='modal'>
//                 <Button size='lg' className='text-lg px-8'>
//                   Get Started Free
//                 </Button>
//               </SignInButton> */}
//               <Button
//                 variant='outline'
//                 size='lg'
//                 className='text-lg px-8 bg-transparent'
//               >
//                 View Demo
//               </Button>
//             </div>
//           </div>
//         </section>

//         {/* Features */}
//         <section className='py-16 px-4 bg-muted/30'>
//           <div className='container mx-auto max-w-6xl'>
//             <h3 className='text-3xl font-bold font-sans text-center mb-12'>
//               Everything You Need to Start Billing
//             </h3>
//             <div className='grid md:grid-cols-3 gap-8'>
//               <Card>
//                 <CardHeader>
//                   <Shield className='h-12 w-12 text-primary mb-4' />
//                   <CardTitle className='font-sans'>
//                     Secure Authentication
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <CardDescription className='font-serif'>
//                     Clerk handles user management, authentication, and security
//                     so you can focus on your product.
//                   </CardDescription>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <Plus className='h-12 w-12 text-primary mb-4' />
//                   <CardTitle className='font-sans'>
//                     Stripe Integration
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <CardDescription className='font-serif'>
//                     Accept payments, manage subscriptions, and handle billing
//                     with Stripes powerful platform.
//                   </CardDescription>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <Zap className='h-12 w-12 text-primary mb-4' />
//                   <CardTitle className='font-sans'>Instant Setup</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <CardDescription className='font-serif'>
//                     No complex integrations. Get your billing dashboard running
//                     in minutes, not days.
//                   </CardDescription>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className='border-t bg-card py-8'>
//         <div className='container mx-auto px-4 text-center'>
//           <p className='text-muted-foreground font-serif'>
//             Built with Next.js, Clerk, and Stripe
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }
