import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SurveySolver } from '@/components/SurveySolver';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ErrorBoundary>
        <Header />
        <main className="flex-1">
          <SurveySolver />
        </main>
        <Footer />
      </ErrorBoundary>
    </div>
  );
}
