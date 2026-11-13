import { redirect } from 'next/navigation';

// Shortcut: /cinema opens the studio on this tab.
export default function Page() {
  redirect('/studio?tab=cinema');
}
