import { describe, expect, it } from '@jest/globals';
import { getTsImageResources, pickTsImageUrl } from '../ts-image';

describe('ts image resources', () => {
  it('reads image resources from an array', () => {
    expect(pickTsImageUrl({
      imageResources: [
        { imageType: 'story_scene', url: 'https://example.com/scene.png' },
        { imageType: 'character_avatar', url: 'https://example.com/avatar.png' },
      ],
    }, 'character_avatar')).toBe('https://example.com/avatar.png');
  });

  it('reads image resources from a backend map', () => {
    const source = {
      imageResources: {
        storyScene: { imageType: 'story_scene', url: 'https://example.com/scene.png' },
        characterAvatar: { imageType: 'character_avatar', url: 'https://example.com/avatar.png' },
      },
    };

    expect(getTsImageResources(source)).toHaveLength(2);
    expect(pickTsImageUrl(source, 'character_avatar')).toBe('https://example.com/avatar.png');
  });

  it('ignores empty image URLs', () => {
    expect(getTsImageResources({
      imageResources: {
        empty: { imageType: 'character_avatar', url: '   ' },
      },
    })).toEqual([]);
  });
});
