import re
file_path = 'src/components/pages/create-role/create-character.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'react-native-svg' not in content:
    content = content.replace(
        "import { Alert, Modal, ScrollView, TextInput } from 'react-native';",
        "import { Alert, Modal, ScrollView, TextInput } from 'react-native';\nimport Svg, { Line } from 'react-native-svg';"
    )
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Imported Svg')
else:
    print('Svg already imported')
