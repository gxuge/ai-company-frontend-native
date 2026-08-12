import type { Href } from 'expo-router';
import { Redirect } from 'expo-router';

export default function SessionListRedirect() {
  return <Redirect href={'/pages/chat-list' as Extract<Href, string>} />;
}
