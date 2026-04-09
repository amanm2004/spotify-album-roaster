import { Header } from '@/components/header';
import RoastInterface from '@/components/roast-interface';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <RoastInterface />
    </div>
  );
}
