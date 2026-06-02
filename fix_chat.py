import re

file_path = 'src/app/pages/chat/index.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '  return (\n    <View style={styles.container}>\n      <SafeAreaView style={styles.safeArea}>',
    '  return (\n    <div className="flex h-[100dvh] w-full justify-center bg-background overflow-hidden">\n      <div className="relative flex h-full w-full max-w-[420px] flex-col bg-black">\n        <SafeAreaView style={styles.safeArea}>'
)

content = content.replace(
    '        <View style={styles.tabContainer}>\n          <AiBottomTabs />\n        </View>\n      </SafeAreaView>\n    </View>\n  );',
    '        <View style={styles.tabContainer}>\n          <AiBottomTabs />\n        </View>\n      </SafeAreaView>\n      </div>\n    </div>\n  );'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed layout wrapper')
