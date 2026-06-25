const fs = require('fs');
let content = fs.readFileSync('src/app/pages/create-story/index.tsx', 'utf8');

const regex = /setChapters\(nextChapters\);\s*\n\s*}\s*\n\s*(?:.*\n)*?.*<Modal\n\s*visible=\{generateModalTarget !== null\}/;

const replacement = `setChapters(nextChapters);
      }

      showMessage('故事保存成功。');
      router.push({
        pathname: '/pages/conversation-detail',
        params: { storyId: String(currentStoryId) },
      });
    }
    catch (error) {
      showMessage(extractErrorMessage(error, '故事保存失败，请稍后重试。'));
    }
    finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-full justify-center bg-background">
      <div className="flex min-h-full w-full max-w-[420px] flex-col bg-black">
        <Header />
        <ScrollView className="flex-1">
          <div className="flex flex-col gap-[32px] px-[16px] pt-[10px] pb-[8px]">
            <TabToggle activeTab={activeTab} onChange={setActiveTab} />
            <StorySettingsSection
              text={storySettingText}
              onChange={setStorySettingText}
              onGenerate={() => setGenerateModalTarget('setting')}
              onOptimize={() => void handleOptimizeStorySetting()}
              generateLoading={generatingSetting}
              optimizeLoading={optimizingSetting}
              onHelpClick={() => setTooltipType('story')}
            />
            <CharacterListSection
              roles={selectedRoles}
              onAddRole={() => router.push('/pages/select-role?from=create-story')}
              onRemoveRole={(role) => setSelectedRoles(prev => prev.filter(r => r.id !== role.id))}
              onHelpClick={() => setTooltipType('role')}
            />
            <LocationSection
              text={sceneSettingText}
              onChange={setSceneSettingText}
              onGenerate={() => setGenerateModalTarget('scene')}
              onOptimize={() => void handleOptimizeSceneSetting()}
              generateLoading={generatingScene}
              optimizeLoading={optimizingScene}
              onHelpClick={() => setTooltipType('scene')}
              sceneImageUrl={sceneImageUrl}
              onSelectSceneImage={() => showMessage('场景图片生成接口待定，将根据场景设定自动生成。')}
              onSceneImageHelpClick={() => setTooltipType('scene_image')}
            />
            <PlotOutlineSection
              activeTab={activeTab}
              outlineText={outlineText}
              onOutlineChange={setOutlineText}
              chapters={chapters}
              onChapterChange={(index, chapter) => {
                setChapters(prev => prev.map((item, current) => (current === index ? chapter : item)));
              }}
              onAddChapter={() => {
                setChapters(prev => [...prev, createDefaultChapter(prev.length + 1)]);
              }}
              onGenerate={() => setGenerateModalTarget('outline')}
              onOptimize={() => void handleOptimizePlotOutline()}
              generateLoading={generatingOutline}
              optimizeLoading={optimizingOutline}
              onHelpClick={() => setTooltipType('outline')}
              selectedRoles={selectedRoles}
              onOpenRoleSelector={setSelectingRoleChapterIndex}
            />
            <div className="h-[20px] shrink-0" />
          </div>
        </ScrollView>
        <BottomButton loading={saving || loadingDetail} onNext={handleSaveAndNext} />
      </div>

      <Modal
        visible={generateModalTarget !== null}`;

const newContent = content.replace(regex, replacement);
if (newContent === content) {
    console.log('NO MATCH FOUND!');
    process.exit(1);
}

fs.writeFileSync('src/app/pages/create-story/index.tsx', newContent);
console.log('SUCCESS!');
