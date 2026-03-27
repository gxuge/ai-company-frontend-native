import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { styles } from './styles';

// ─── SVG Icon Generators ───
// SVGs from Figma use CSS variables; we replace them with function params for RN

const arrowLeftSvg = (color: string) => `
<svg width="18" height="17" viewBox="0 0 35 33.6" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M29.3419 15.3994H10.3327L17.3915 8.36998L15.4161 6.38618L4.95811 16.8008L15.4161 27.214L17.3915 25.2302L10.3299 18.1994H29.3419V15.3994Z" fill="${color}"/>
</svg>`;

const gallerySvg = (color: string) => `
<svg width="17" height="17" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M23.6508 0C29.2431 0 33 3.92389 33 9.76259V23.2374C33 29.0761 29.2431 33 23.6491 33H9.3492C3.75688 33 0 29.0761 0 23.2374V9.76259C0 3.92389 3.75688 0 9.3492 0H23.6508ZM25.4704 17.4076C23.7017 16.3042 22.3361 17.8537 21.9678 18.3492C21.6127 18.8277 21.3074 19.3556 20.9856 19.8834C20.1991 21.1861 19.2981 22.6879 17.7385 23.5615C15.472 24.8164 13.7514 23.6602 12.5137 22.819C12.0491 22.5057 11.5978 22.2094 11.1481 22.0119C10.0398 21.5334 9.04262 22.0783 7.56261 23.9582C6.78611 24.9407 6.01624 25.9147 5.23641 26.8853C4.77018 27.4659 4.88134 28.3616 5.51018 28.7498C6.514 29.368 7.73849 29.7 9.12226 29.7H23.028C23.8128 29.7 24.5993 29.5927 25.3493 29.3475C27.0383 28.7958 28.379 27.5324 29.0791 25.8636C29.6698 24.4605 29.9569 22.7577 29.4043 21.341C29.2202 20.8711 28.9447 20.4334 28.5582 20.0486C27.5444 19.0423 26.597 18.1023 25.4704 17.4076ZM10.7231 6.6C8.44835 6.6 6.6 8.45085 6.6 10.725C6.6 12.9991 8.44835 14.85 10.7231 14.85C12.9962 14.85 14.8462 12.9991 14.8462 10.725C14.8462 8.45085 12.9962 6.6 10.7231 6.6Z" fill="${color}"/>
</svg>`;

const refImageSvg = (color: string) => `
<svg width="19" height="18" viewBox="0 0 37 35" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M35.0805 5.53086H31.1521V1.81481C31.1521 0.777777 30.3298 0 29.2336 0C28.1373 0 27.315 0.777777 27.315 1.81481V5.53086H23.3866C22.2904 5.53086 21.4681 6.30864 21.4681 7.34568C21.4681 8.38271 22.2904 9.16048 23.3866 9.16048H27.315V12.8765C27.315 13.9136 28.1373 14.6913 29.2336 14.6913C30.3298 14.6913 31.1521 13.9136 31.1521 12.8765V9.16048H35.0805C36.1768 9.16048 36.999 8.38271 36.999 7.34568C36.999 6.30864 36.1768 5.53086 35.0805 5.53086ZM25.3052 12.8765V11.0617H23.3866C22.2904 11.0617 21.3769 10.6296 20.646 9.93825C19.9151 9.24689 19.4583 8.38271 19.4583 7.34568C19.4583 6.65432 19.6409 6.04937 20.0064 5.53086H3.9274C1.73482 5.53086 -0.000976562 7.17282 -0.000976562 9.16048V31.284C-0.000976562 33.3581 1.73482 35 3.9274 35H27.315C29.4164 35 31.1521 33.3581 31.1521 31.284V16.0741C30.6039 16.3333 29.9644 16.5926 29.2336 16.5926C27.041 16.5061 25.3052 14.8642 25.3052 12.8765ZM25.2138 31.284H5.84593C5.0237 31.284 4.56692 30.4197 5.0237 29.8148L8.9521 24.9753C9.31753 24.4567 10.1397 24.5432 10.5052 25.0618L13.6114 29.4691L18.7274 23.074C19.0928 22.5556 19.9151 22.5556 20.2804 23.074L26.0361 29.8148C26.4929 30.4197 26.0361 31.284 25.2138 31.284Z" fill="${color}"/>
</svg>`;

const aiSparkleSvg = (color: string) => `
<svg width="19" height="20" viewBox="0 0 37.9347 39.2972" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M32.5058 12.0484L34.025 8.65074L37.3313 7.13071C38.1356 6.86248 38.1356 5.78952 37.3313 5.43187L34.025 3.91183L32.5058 0.60354C32.1483 -0.20118 31.1654 -0.20118 30.8079 0.60354L29.2887 3.91183L25.8928 5.43187C25.1779 5.78952 25.1779 6.77306 25.8928 7.13071L29.2887 8.65074L30.8079 12.0484C31.0759 12.7638 32.1483 12.7638 32.5058 12.0484ZM17.314 14.9097L14.2757 8.20367C13.6502 6.68365 11.5055 6.68365 10.8799 8.20367L7.84158 14.9097L1.13938 17.9497C-0.379792 18.5756 -0.379792 20.7216 1.13938 21.3474L7.84158 24.3876L10.8799 31.0935C11.5055 32.6136 13.6502 32.6136 14.2757 31.0935L17.314 24.3876L24.0163 21.3474C25.5354 20.7216 25.5354 18.5756 24.0163 17.9497L17.314 14.9097ZM30.8079 27.2488L29.2887 30.6464L25.8928 32.1665C25.1779 32.4347 25.1779 33.5076 25.8928 33.8653L29.2887 35.3853L30.8079 38.6937C31.0759 39.4983 32.1483 39.4983 32.5058 38.6937L34.025 35.3853L37.3313 33.8653C38.1356 33.5076 38.1356 32.5241 37.3313 32.1665L34.025 30.6464L32.5058 27.2488C32.1483 26.5335 31.0759 26.5335 30.8079 27.2488Z" fill="${color}" fill-opacity="0.9"/>
</svg>`;

// ─── Style Options Data ───
const STYLE_OPTIONS = [
  {
    id: 'general',
    label: '通用',
    image: require('../../../assets/images/create-character/style_general.png'),
  },
  {
    id: 'pixel',
    label: '像素艺术',
    image: require('../../../assets/images/create-character/style_pixel.png'),
  },
  {
    id: 'manga',
    label: '漫画',
    image: require('../../../assets/images/create-character/style_manga.png'),
  },
  {
    id: 'impasto',
    label: '厚涂',
    image: require('../../../assets/images/create-character/style_impasto.png'),
  },
];

// ─── Main Component ───
export default function CreateCharacter() {
  const [activeTab, setActiveTab] = useState<'image' | 'role'>('image');
  const [selectedStyle, setSelectedStyle] = useState('general');

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <SvgXml xml={arrowLeftSvg('#fff')} width={18} height={17} />
          </Pressable>
          <Text style={styles.headerTitle}>创建人物</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Tabs ── */}
          <View style={styles.tabsContainer}>
            <View style={styles.tabsRow}>
              <Pressable style={styles.tabItem} onPress={() => setActiveTab('image')}>
                <Text
                  style={activeTab === 'image' ? styles.tabTextActive : styles.tabTextInactive}
                >
                  形象
                </Text>
                {activeTab === 'image' && <View style={styles.tabIndicator} />}
              </Pressable>
              <Pressable style={styles.tabItem} onPress={() => setActiveTab('role')}>
                <Text
                  style={activeTab === 'role' ? styles.tabTextActive : styles.tabTextInactive}
                >
                  角色
                </Text>
                {activeTab === 'role' && <View style={styles.tabIndicator} />}
              </Pressable>
            </View>
          </View>

          {/* ── 我的图库 Button ── */}
          <View style={styles.galleryBtnRow}>
            <Pressable style={styles.galleryBtn}>
              <SvgXml xml={gallerySvg('#fff')} width={17} height={17} />
              <Text style={styles.galleryText}>我的图库</Text>
            </Pressable>
          </View>

          {/* ── Image Card ── */}
          <View style={styles.imageCard}>
            {/* Background Image */}
            <Image
              source={require('../../../assets/images/create-character/bg_character.png')}
              style={styles.imageCardBg}
              resizeMode="cover"
            />
            {/* Dark overlay */}
            <View style={styles.imageCardOverlay} />

            <View style={styles.imageCardContent}>
              <View style={styles.imageCardSpacer} />

              {/* Centered Text */}
              <View style={styles.imageCardTextGroup}>
                <Text style={styles.imageCardTitle}>输入你想要的形象</Text>
                <Text style={styles.imageCardSubtitle}>
                  如性别、外貌、性格、身材、衣着以{'\n'}及其他特征
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.imageCardButtons}>
                <Pressable style={styles.refButton}>
                  <SvgXml xml={refImageSvg('#fff')} width={19} height={18} />
                  <Text style={styles.refButtonText}>参考图</Text>
                </Pressable>
                <Pressable style={styles.aiButton}>
                  <SvgXml
                    xml={aiSparkleSvg('rgba(155,254,3,0.9)')}
                    width={19}
                    height={20}
                  />
                  <Text style={styles.aiButtonText}>AI 生成</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* ── Style Section ── */}
          <View style={styles.styleSection}>
            <View style={styles.styleSectionHeader}>
              <Text style={styles.styleSectionTitle}>风格</Text>
              <Pressable style={styles.moreBtn}>
                <Text style={styles.moreBtnText}>更多</Text>
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.styleGrid}>
                {STYLE_OPTIONS.map((item) => {
                  const isActive = selectedStyle === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      style={styles.styleItem}
                      onPress={() => setSelectedStyle(item.id)}
                    >
                      <View
                        style={
                          isActive
                            ? styles.styleThumbWrapperActive
                            : styles.styleThumbWrapperInactive
                        }
                      >
                        <Image source={item.image} style={styles.styleThumb} />
                      </View>
                      <Text
                        style={isActive ? styles.styleLabelActive : styles.styleLabelInactive}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
