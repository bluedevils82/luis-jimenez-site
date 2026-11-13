import { redirect } from 'next/navigation';

// Shortcut: /effects opens the studio on this tab.
export default function Page() {
  redirect('/studio?tab=effects');
}
