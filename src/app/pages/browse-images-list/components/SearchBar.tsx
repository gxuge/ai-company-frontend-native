import { View, TextInput } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
}

export function SearchBar({
  placeholder = '搜索',
  value,
  onChangeText,
  onSubmitEditing,
}: SearchBarProps) {
  return (
    <View style={{ paddingHorizontal: 12, marginVertical: 4 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 44,
          backgroundColor: '#202020',
          borderRadius: 22,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.15)',
          paddingHorizontal: 16,
          gap: 10,
        }}
      >
        {/* Search icon */}
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Circle cx={11} cy={11} r={8} stroke="#909090" strokeWidth={2} />
          <Path d="M21 21l-4.35-4.35" stroke="#909090" strokeWidth={2} strokeLinecap="round" />
        </Svg>

        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#909090"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="search"
          style={{
            flex: 1,
            fontSize: 14,
            color: '#e7e7e7',
            fontFamily: 'Noto Sans SC',
          }}
        />
      </View>
    </View>
  );
}
