import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";
import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import type { AppProps } from 'next/app';
import { AnalyticsProvider } from '@/analytics';

// Define the custom AppPropsWithLayout type
type AppPropsWithLayout = AppProps & {
  Component: AppProps['Component'] & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
  };
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const isAuthPage = router.pathname.startsWith('/auth');
  const isStartPage = router.pathname === '/start';
  const isChatbotPage = router.pathname === '/chatbot';
  const isDashboardPage = router.pathname === '/dashboard';
  const isPredictionPage = router.pathname === '/prediction';
  const isTechTeamPage = router.pathname === '/tech-team';

  const shouldExcludeLayout = isAuthPage || isStartPage || isChatbotPage || isDashboardPage || isPredictionPage || isTechTeamPage;

  // Use the getLayout function if it exists, otherwise use the default layout
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <>
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
      <AnalyticsProvider />
    </>
  );
}
