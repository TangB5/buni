import { redirect } from 'next/navigation';
import { Route } from 'next';

export default function CouleursIndexPage() {
  redirect('/documentation/couleurs/introduction' as Route);
}
