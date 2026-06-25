import { View, Image } from 'react-native';
const imgMain = require('../../../assets/images/browse-images-list/43a96fc9c5b518385cdb7450c72740a4259ee56b.png');

interface ImageCardProps {
  imageUrl?: string;
}

export function ImageCard({
  imageUrl,
}: ImageCardProps) {
  return (
    <View style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', width: '100%', aspectRatio: 208 / 292 }}>
      <Image
        source={imageUrl ? { uri: imageUrl } : imgMain}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    </View>
  );
}
