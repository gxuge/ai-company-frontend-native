import { useState } from 'react';
import { View, Pressable, Image } from 'react-native';

const imgHome    = require('../../../../assets/images/browse-images-list/bottom-nav-home.svg');
const imgSearch  = require('../../../../assets/images/browse-images-list/bottom-nav-search.svg');
const imgCreate  = require('../../../../assets/images/browse-images-list/bottom-nav-create.svg');
const imgBadge   = require('../../../../assets/images/browse-images-list/bottom-nav-create-badge.svg');
const imgChat    = require('../../../../assets/images/browse-images-list/bottom-nav-chat.svg');
const imgProfile = require('../../../../assets/images/browse-images-list/bottom-nav-profile.svg');

const NAV_ITEMS = [
  { icon: imgHome,    badge: null },
  { icon: imgSearch,  badge: null },
  { icon: imgCreate,  badge: imgBadge },
  { icon: imgChat,    badge: null },
  { icon: imgProfile, badge: null },
];

export function BottomNav() {
  const [active, setActive] = useState(0);

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000',
        borderTopWidth: 1,
        borderTopColor: '#111',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: 56,
          paddingHorizontal: 8,
        }}
      >
        {NAV_ITEMS.map((item, i) => (
          <Pressable
            key={i}
            onPress={() => setActive(i)}
            style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
          >
            <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={item.icon}
                style={{ width: i === 2 ? 30 : 24, height: i === 2 ? 30 : 24, opacity: i === active ? 1 : 0.5 }}
                resizeMode="contain"
              />
              {item.badge && (
                <Image
                  source={item.badge}
                  style={{ position: 'absolute', bottom: -8, width: 14, height: 14, opacity: i === active ? 1 : 0.5 }}
                  resizeMode="contain"
                />
              )}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
