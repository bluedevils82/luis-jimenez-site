import { redirect } from 'next/navigation';

// Shortcut: /assistant opens the chat assistant.
export default function Page() {
  redirect('/studio?tab=assistant');
}
