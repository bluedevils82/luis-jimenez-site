import { redirect } from 'next/navigation';

// Shortcut: /lipsync opens the studio on this tab.
export default function Page() {
  redirect('/studio?tab=lipsync');
}
