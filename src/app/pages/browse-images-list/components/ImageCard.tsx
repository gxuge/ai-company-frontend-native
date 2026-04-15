import { View, Image, Text } from 'react-native';

const imgAvatar = require('../../../../assets/images/browse-images-list/f237e684d01d55d9ec3a722678f8a240c02ceb8b.png');
const imgEye = require('../../../../assets/images/browse-images-list/26c770612af2df2377f95228e63007b26e0e21bd.png');
const imgMain = require('../../../../assets/images/browse-images-list/43a96fc9c5b518385cdb7450c72740a4259ee56b.png');

interface ImageCardProps {
  imageUrl?: string;
  username?: string;
  author?: string;
  views?: string;
  authorAvatarUrl?: string;
}

export function ImageCard({
  imageUrl,
  username = '@user',
  author = '--',
  views = '--',
  authorAvatarUrl,
}: ImageCardProps) {
  return (
    <View style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
      <Image
        source={imageUrl ? { uri: imageUrl } : imgMain}
        style={{ width: '100%', aspectRatio: 3 / 4 }}
        resizeMode="cover"
      />

      <View
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: 999,
          paddingHorizontal: 8,
          paddingVertical: 2,
        }}
      >
        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '500' }}>
          {username}
        </Text>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(141,141,141,0.5)',
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          paddingHorizontal: 10,
          paddingTop: 10,
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Image
            source={authorAvatarUrl ? { uri: authorAvatarUrl } : imgAvatar}
            style={{ width: 18, height: 18, borderRadius: 9 }}
            resizeMode="cover"
          />
          <Text style={{ color: '#cec1b4', fontSize: 8, fontWeight: '700' }}>{author}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Image source={imgEye} style={{ width: 14, height: 10 }} resizeMode="cover" />
          <Text style={{ color: '#bfbcbd', fontSize: 11 }}>{views}</Text>
        </View>
      </View>
    </View>
  );
}
