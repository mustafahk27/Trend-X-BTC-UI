import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";
import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import type { AppPropsWithLayout } from 'next/app';

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const isAuthPage = router.pathname.startsWith('/auth');
  const isStartPage = router.pathname === '/start';
  const isChatbotPage = router.pathname === '/chatbot';
  const isDashboardPage = router.pathname === '/dashboard';
  const isPredictionPage = router.pathname === '/prediction';

  const shouldExcludeLayout = isAuthPage || isStartPage || isChatbotPage || isDashboardPage || isPredictionPage;

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: { colorPrimary: '#F7931A' },
        elements: {
          formButtonPrimary: 
            'bg-[#F7931A] hover:bg-[#F7931A]/90 text-black font-medium',
          card: 'bg-black/50 backdrop-blur-sm border border-white/10',
        }
      }}
    >
      {shouldExcludeLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </ClerkProvider>
  );
}
