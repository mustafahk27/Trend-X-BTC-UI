import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import { Url } from "next/dist/shared/lib/router/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPublicRoute = ['/', '/auth/sign-in', '/auth/sign-up'].includes(router.pathname);

  return (
    <ClerkProvider 
      {...pageProps}
      navigate={(to: Url) => router.push(to)}
      afterSignInUrl="/home"
      afterSignUpUrl="/home"
    >
      <Layout>
        {isPublicRoute ? (
          <Component {...pageProps} />
        ) : (
          <>
            <SignedOut>
              <div className="flex min-h-screen items-center justify-center bg-black">
                <div className="text-center">
                  <h1 className="mb-4 text-2xl font-bold text-white">
                    Please sign in to continue
                  </h1>
                  <SignInButton mode="modal">
                    <button className="rounded-full bg-white px-6 py-2 font-semibold text-black transition hover:bg-gray-200">
                      Sign In
                    </button>
                  </SignInButton>
                </div>
              </div>
            </SignedOut>
            <SignedIn>
              <Component {...pageProps} />
            </SignedIn>
          </>
        )}
      </Layout>
    </ClerkProvider>
  );
}

export default MyApp;
