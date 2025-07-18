import { SurveySolver } from '@/components/SurveySolver';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function Home() {
  return (
    <ErrorBoundary>
      <SurveySolver />
    </ErrorBoundary>
  );
}
