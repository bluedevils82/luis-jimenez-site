import { redirect } from 'next/navigation';

// Shortcut: /tools opens the studio on this tab.
export default function Page() {
  redirect('/studio?tab=tools');
}
