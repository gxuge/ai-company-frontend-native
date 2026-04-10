import svgPaths from '../../../../assets/images/story-detail/svg-m13tfs0op9';

function GlowText({ children }) {
  return (
    <span
      className="inline text-white font-['Noto_Sans_SC',sans-serif]"
      style={{
        borderBottom: '2px solid rgba(155,254,3,0.5)',
        textShadow: '0px 0px 10px rgba(155,254,3,0.6)',
      }}
    >
      {children}
    </span>
  );
}

function TagPill({ children }) {
  return (
    <span
      className="mx-[1px] inline-flex items-center rounded-full px-[8px] py-[1px] align-baseline font-['Noto_Sans_SC',sans-serif] text-[14px] md:mx-[2px] md:px-[13px] md:py-[2px] md:text-[25.6px]"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1.5px solid rgba(255,255,255,0.1)',
        color: '#e5e5e5',
        lineHeight: '1.6',
      }}
    >
      {children}
    </span>
  );
}

function BoldWhite({ children }) {
  return <span className="font-['Noto_Sans_SC',sans-serif] font-medium text-white">{children}</span>;
}

function SectionHeading({ title }) {
  return (
    <div className="flex items-center overflow-hidden rounded-tr-[15px] rounded-br-[15px] py-[6px] md:rounded-tr-[30px] md:rounded-br-[30px] md:py-[11px]">
      <div
        className="w-[3px] shrink-0 self-stretch md:w-[4px]"
        style={{ background: 'rgba(155,254,3,0.9)' }}
      />
      <span
        className="pl-3 font-['Noto_Sans_SC',sans-serif] text-[18px] font-bold leading-[26px] text-white md:pl-5 md:text-[30px] md:leading-[44px]"
      >
        {title}
      </span>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="23" height="29" viewBox="0 0 23 29" fill="none">
      <path d={svgPaths.p2be67400} fill="white" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

function normalizeText(value, fallback) {
  if (typeof value !== 'string') {
    return fallback;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
}

function buildChapterTitle(chapter, index) {
  const chapterNo = typeof chapter?.chapterNo === 'number' && Number.isFinite(chapter.chapterNo)
    ? chapter.chapterNo
    : index + 1;
  const title = normalizeText(chapter?.chapterTitle, '');
  return title || `第${chapterNo}章`;
}

function buildChapterContent(chapter) {
  const chapterDesc = normalizeText(chapter?.chapterDesc, '');
  const openingContent = normalizeText(chapter?.openingContent, '');
  const missionTarget = normalizeText(chapter?.missionTarget, '');
  return chapterDesc || openingContent || missionTarget || '暂无章节内容';
}

export default function StoryDetailModal({
  onClose = () => {},
  storyTitle = '故事详情',
  storySetting = '',
  storyBackground = '',
  chapters = [],
  loading = false,
  loadError = null,
}) {
  const settingText = normalizeText(storySetting, '暂无故事设定');
  const backgroundText = normalizeText(storyBackground, '暂无背景补充');
  const chapterList = Array.isArray(chapters) ? chapters : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-[30px]">
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />

      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-[60] flex size-12 items-center justify-center md:top-[46px] md:left-[46px] md:h-[60px] md:w-[60px]"
        style={{
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(12px)',
          border: 'none',
        }}
      >
        <CloseIcon />
      </button>

      <div
        className="relative z-[55] flex h-full w-full max-w-[654px] flex-col overflow-hidden"
        style={{
          maxHeight: '90vh',
          background: '#161616',
          borderRadius: '20px',
          border: '2px solid #424242',
        }}
      >
        <div
          className="pointer-events-none absolute top-0 right-0 left-0 z-10"
          style={{
            height: '80px',
            background: 'linear-gradient(to bottom, #161616 0%, rgba(22,22,22,0) 100%)',
          }}
        />

        <div className="absolute top-0 right-0 left-0 z-20 px-5 pt-6 md:px-[46px] md:pt-[46px]">
          <h2
            className="font-['Noto_Sans_SC',sans-serif] text-[24px] font-bold leading-[34px] text-white md:text-[38px] md:leading-[54px]"
          >
            故事详情
          </h2>
          <p className="mt-1 font-['Noto_Sans_SC',sans-serif] text-[14px] text-[#9ca3af] md:text-[18px]">
            {normalizeText(storyTitle, '未命名故事')}
          </p>
        </div>

        <div className="relative flex-1 overflow-y-auto pb-8">
          <div className="px-5 pt-[100px] md:px-[30px] md:pt-[148px]">
            <div className="flex flex-col gap-8 md:gap-[46px]">
              <div className="flex flex-col gap-4 md:gap-[23px]">
                <SectionHeading title="故事设定" />
                <div className="font-['Noto_Sans_SC',sans-serif] text-[15px] leading-[26px] text-[#d1d5db] md:text-[27px] md:leading-[44px]">
                  {settingText}
                </div>
              </div>

              <div className="flex flex-col gap-4 md:gap-[23px]">
                <SectionHeading title="背景补充" />
                <div className="font-['Noto_Sans_SC',sans-serif] text-[15px] leading-[26px] text-[#d1d5db] md:text-[27px] md:leading-[44px]">
                  {backgroundText}
                </div>
              </div>

              {chapterList.length === 0
                ? (
                    <div className="flex flex-col gap-4 md:gap-[23px]">
                      <SectionHeading title="章节详情" />
                      <div className="font-['Noto_Sans_SC',sans-serif] text-[15px] leading-[26px] text-[#d1d5db] md:text-[27px] md:leading-[44px]">
                        <GlowText>暂无章节内容</GlowText>
                      </div>
                    </div>
                  )
                : chapterList.slice(0, 6).map((chapter, index) => (
                    <div key={chapter?.id || index} className="flex flex-col gap-4 md:gap-[23px]">
                      <SectionHeading title={buildChapterTitle(chapter, index)} />
                      <div className="font-['Noto_Sans_SC',sans-serif] text-[15px] leading-[26px] text-[#d1d5db] md:text-[27px] md:leading-[44px]">
                        <BoldWhite>{buildChapterContent(chapter)}</BoldWhite>
                      </div>
                    </div>
                  ))}

              {loading ? <div className="text-[13px] text-[#9ca3af]">章节加载中...</div> : null}
              {loadError ? <div className="text-[13px] text-[#fca5a5]">{loadError}</div> : null}

              <div className="font-['Noto_Sans_SC',sans-serif] text-[14px] leading-[24px] text-[#9ca3af] md:text-[18px] md:leading-[32px]">
                <TagPill>提示</TagPill>
                <span className="ml-2">
                  可以在聊天页点击
                  <GlowText>故事详情</GlowText>
                  持续查看设定与章节。
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute right-0 bottom-0 left-0 z-10"
          style={{
            height: '80px',
            background: 'linear-gradient(to top, #161616 0%, rgba(22,22,22,0) 100%)',
          }}
        />
      </div>
    </div>
  );
}
