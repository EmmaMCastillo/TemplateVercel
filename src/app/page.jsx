import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
  return null; // Esto no se ejecutará porque la redirección ocurre antes
}