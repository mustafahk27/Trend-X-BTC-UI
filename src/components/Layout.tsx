import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from 'next/link';
import { useRouter } from 'next/router';

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const showHeader = router.pathname !== '/' && router.pathname !== '/auth/sign-in' && router.pathname !== '/auth/sign-up';

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#111] text-black dark:text-white">
      {showHeader && (
        <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <nav className="flex items-center space-x-6">
              <Link href="/home" className="font-bold text-xl">
                TradingAI
              </Link>
              <SignedIn>
                <div className="hidden md:flex space-x-6">
                  <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
                    Dashboard
                  </Link>
                  <Link href="/chatbot" className="text-sm font-medium hover:text-primary">
                    Chatbot
                  </Link>
                  <Link href="/prediction" className="text-sm font-medium hover:text-primary">
                    Prediction
                  </Link>
                </div>
              </SignedIn>
            </nav>
            <div className="flex items-center space-x-4">
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium hover:text-primary">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </header>
      )}
      {children}
    </div>
  );
}
