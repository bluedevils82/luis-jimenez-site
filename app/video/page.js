import { redirect } from 'next/navigation';

// Shortcut: /video opens the studio on this tab.
export default function Page() {
  redirect('/studio?tab=video');
}
