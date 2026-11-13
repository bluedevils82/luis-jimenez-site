import { redirect } from 'next/navigation';

// Shortcut: /outputs opens the My Outputs gallery.
export default function Page() {
  redirect('/studio?tab=outputs');
}
