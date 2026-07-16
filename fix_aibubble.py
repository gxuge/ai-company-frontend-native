with open('src/app/pages/admin-chat/index.tsx', encoding='utf-8', errors='replace') as f:
    lines = f.readlines()

print('Total lines:', len(lines))
for i, line in enumerate(lines[215:250], start=216):
    print(f'{i}: {repr(line)}')
