import { LoginForm } from '@/components/AuthComponents';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <LoginForm onLogin={async () => {}} />
    </main>
  );
}