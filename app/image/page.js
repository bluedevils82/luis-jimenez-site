import { redirect } from 'next/navigation';

// Shortcut: /image opens the studio on this tab.
export default function Page() {
  redirect('/studio?tab=image');
}
