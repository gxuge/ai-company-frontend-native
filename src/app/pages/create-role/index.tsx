import { CreateCharacter } from "./components/create-character";
import { View } from 'react-native';

export default function App() {
  return (
    <View className="size-full bg-black">
      <CreateCharacter />
    </View>
  );
}
