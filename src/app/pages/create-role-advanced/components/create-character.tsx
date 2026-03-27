import { useState } from "react";
const svgPaths = {
p1764b200: "M22.2792 7.97156L23.3204 5.72355L25.5866 4.71786C26.1378 4.54039 26.1378 3.83049 25.5866 3.59386L23.3204 2.58817L22.2792 0.399317C22.0342 -0.133106 21.3604 -0.133106 21.1154 0.399317L20.0742 2.58817L17.7468 3.59386C17.2568 3.83049 17.2568 4.48123 17.7468 4.71786L20.0742 5.72355L21.1154 7.97156C21.2992 8.44482 22.0342 8.44482 22.2792 7.97156ZM11.8669 9.86462L9.78445 5.42776C9.35571 4.42207 7.88575 4.42207 7.45701 5.42776L5.37456 9.86462L0.780919 11.876C-0.260306 12.2901 -0.260306 13.7099 0.780919 14.124L5.37456 16.1354L7.45701 20.5722C7.88575 21.5779 9.35571 21.5779 9.78445 20.5722L11.8669 16.1354L16.4605 14.124C17.5018 13.7099 17.5018 12.2901 16.4605 11.876L11.8669 9.86462ZM21.1154 18.0284L20.0742 20.2765L17.7468 21.2821C17.2568 21.4596 17.2568 22.1695 17.7468 22.4061L20.0742 23.4118L21.1154 25.6007C21.2992 26.1331 22.0342 26.1331 22.2792 25.6007L23.3204 23.4118L25.5866 22.4061C26.1378 22.1695 26.1378 21.5188 25.5866 21.2821L23.3204 20.2765L22.2792 18.0284C22.0342 17.5552 21.2992 17.5552 21.1154 18.0284Z",
p2175f400: "M2.92629 0.409664C2.3579 0.955882 2.3579 1.91176 2.92629 2.45798L8.82327 8.125L2.92629 13.792C2.3579 14.3382 2.3579 15.2941 2.92629 15.8403C3.56572 16.3866 4.48934 16.3866 5.05773 15.8403L12.0204 9.14916C12.6599 8.60294 12.6599 7.64706 12.0204 7.10084L5.05773 0.409664C4.48934 -0.136555 3.56572 -0.136555 2.92629 0.409664Z",
p2f924600: "M29.3419 15.3994H10.3327L17.3915 8.36998L15.4161 6.38618L4.95811 16.8008L15.4161 27.214L17.3915 25.2302L10.3299 18.1994H29.3419V15.3994Z",
p38f77400: "M15 4.375C15.4973 4.375 15.9742 4.57254 16.3258 4.92417C16.6775 5.27581 16.875 5.75272 16.875 6.25V13.125H23.75C24.2473 13.125 24.7242 13.3225 25.0758 13.6742C25.4275 14.0258 25.625 14.5027 25.625 15C25.625 15.4973 25.4275 15.9742 25.0758 16.3258C24.7242 16.6775 24.2473 16.875 23.75 16.875H16.875V23.75C16.875 24.2473 16.6775 24.7242 16.3258 25.0758C15.9742 25.4275 15.4973 25.625 15 25.625C14.5027 25.625 14.0258 25.4275 13.6742 25.0758C13.3225 24.7242 13.125 24.2473 13.125 23.75V16.875H6.25C5.75272 16.875 5.27581 16.6775 4.92417 16.3258C4.57254 15.9742 4.375 15.4973 4.375 15C4.375 14.5027 4.57254 14.0258 4.92417 13.6742C5.27581 13.3225 5.75272 13.125 6.25 13.125H13.125V6.25C13.125 5.75272 13.3225 5.27581 13.6742 4.92417C14.0258 4.57254 14.5027 4.375 15 4.375Z",
};

const fontBase = "font-['Noto_Sans_SC',sans-serif]";

// --- Header ---
function Header({
  activeTab,
  onTabChange,
}: {
  activeTab: "basic" | "advanced";
  onTabChange: (tab: "basic" | "advanced") => void;
}) {
  return (
    <div className="sticky top-0 z-10 bg-[rgba(0,0,0,0.9)] backdrop-blur-md border-b border-white/10 px-4 pb-3 pt-3">
      <div className="flex items-center justify-center relative mb-4">
        <button className="absolute left-0 w-10 h-10 rounded-full bg-[#232322] flex items-center justify-center">
          <svg width="18" height="17" viewBox="0 0 35 33.6" fill="none">
            <path
              clipRule="evenodd"
              d={svgPaths.p2f924600}
              fill="white"
              fillRule="evenodd"
            />
          </svg>
        </button>
        <span className={`text-white text-lg ${fontBase} font-bold`}>
          创建角色
        </span>
      </div>
      <div className="flex bg-black rounded-full border border-[rgba(155,254,3,0.3)] p-1">
        <button
          onClick={() => onTabChange("basic")}
          className={`flex-1 py-2 rounded-full text-sm ${fontBase} transition-colors ${
            activeTab === "basic"
              ? "bg-[rgba(155,254,3,0.9)] text-[#3b3f34] font-bold"
              : "text-[#9ca3af]"
          }`}
        >
          基础信息
        </button>
        <button
          onClick={() => onTabChange("advanced")}
          className={`flex-1 py-2 rounded-full text-sm ${fontBase} transition-colors ${
            activeTab === "advanced"
              ? "bg-[rgba(155,254,3,0.9)] text-[#3b3f34] font-bold"
              : "text-[#9ca3af]"
          }`}
        >
          高级设定
        </button>
      </div>
    </div>
  );
}

// --- Toggle Switch ---
function ToggleSwitch({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-[54px] h-[30px] rounded-full transition-colors shrink-0 ${
        enabled ? "bg-[rgba(155,254,3,0.9)]" : "bg-[#4b5563]"
      }`}
    >
      <div
        className={`absolute top-[3px] w-[24px] h-[24px] rounded-full bg-white transition-transform ${
          enabled ? "left-[27px]" : "left-[3px]"
        }`}
      />
    </button>
  );
}

// --- Public Status Section ---
function PublicStatusSection() {
  const [isPublic, setIsPublic] = useState(true);
  return (
    <section className="flex flex-col gap-3">
      <h2 className={`text-white text-base ${fontBase} font-bold tracking-wide px-1`}>
        公开状态
      </h2>
      <div className="bg-black rounded-2xl border border-[#494949] p-5 flex items-center justify-between">
        <div>
          <p className={`text-white text-sm ${fontBase} font-medium`}>
            是否公开角色
          </p>
          <p className={`text-[#6b7280] text-xs ${fontBase} mt-1`}>
            公开后其他用户可以与该角色对话
          </p>
        </div>
        <ToggleSwitch enabled={isPublic} onToggle={() => setIsPublic(!isPublic)} />
      </div>
    </section>
  );
}

// --- Tag Chip ---
function TagChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-full text-sm ${fontBase} font-medium transition-colors ${
        selected
          ? "bg-[rgba(155,254,3,0.2)] text-[rgba(155,254,3,0.9)] border border-black"
          : "border border-[#4b5563] text-[#9ca3af]"
      }`}
    >
      {label}
    </button>
  );
}

// --- Tags Section ---
function TagsSection() {
  const allTags = ["傲娇", "温柔", "极客", "高冷", "毒舌", "腹黑"];
  const [selectedTags, setSelectedTags] = useState<string[]>(["傲娇", "极客"]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className={`text-white text-base ${fontBase} font-bold tracking-wide`}>
          角色标签
        </h2>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(155,254,3,0.2)] shadow-[0px_0px_6px_0px_rgba(155,254,3,0.2),0px_0px_12px_0px_rgba(155,254,3,0.1)]">
          <svg width="14" height="14" viewBox="0 0 26 26" fill="none">
            <path
              d={svgPaths.p1764b200}
              fill="rgba(155,254,3,0.9)"
            />
          </svg>
          <span className={`text-[rgba(155,254,3,0.9)] text-sm ${fontBase} font-medium`}>
            智能推荐
          </span>
        </button>
      </div>
      <div className="bg-black rounded-2xl border border-[#494949] p-5">
        <div className="flex flex-wrap gap-3">
          {allTags.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              selected={selectedTags.includes(tag)}
              onToggle={() => toggleTag(tag)}
            />
          ))}
          <button className="px-4 py-2 rounded-full border border-dashed border-[#737373] flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 30 30" fill="none">
              <path d={svgPaths.p38f77400} fill="#9CA3AF" />
            </svg>
            <span className={`text-[#9ca3af] text-sm ${fontBase} font-medium`}>
              自定义
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

// --- Option Button ---
function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1 rounded-xl text-xs ${fontBase} transition-colors ${
        selected
          ? "bg-[rgba(155,254,3,0.2)] border border-[rgba(155,254,3,0.9)] text-[rgba(155,254,3,0.9)]"
          : "border border-[#4b5563] text-[#9ca3af]"
      }`}
    >
      {label}
    </button>
  );
}

// --- Dialogue Style Section ---
function DialogueStyleSection() {
  const [dialogLength, setDialogLength] = useState<string>("详细");
  const [interactivity, setInteractivity] = useState<string>("主动引导");

  return (
    <section className="flex flex-col gap-3">
      <h2 className={`text-white text-base ${fontBase} font-bold tracking-wide px-1`}>
        对话风格设定
      </h2>
      <div className="bg-black rounded-2xl border border-[#494949] overflow-hidden">
        {/* Preview */}
        <div className="p-5">
          <div className="flex items-center mb-4">
            <div className="w-[2.5px] h-5 bg-[rgba(155,254,3,0.9)] rounded-full mr-3" />
            <span className={`text-white text-sm ${fontBase} font-bold tracking-wide`}>
              对话风格预览
            </span>
          </div>
          <div className="bg-[#111] rounded-xl border border-[#494949] p-4 shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.05)]">
            <p className={`text-[#d1d5db] text-sm ${fontBase} leading-relaxed`}>
              哼，别以为你这样说我就会高兴...不过，既然你诚心诚意地求我了，我就勉为其难地帮你一次吧。
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-[rgba(155,254,3,0.2)]" />

        {/* 对话长度 */}
        <div className="flex items-center justify-between px-5 py-4">
          <span className={`text-[#d1d5db] text-sm ${fontBase} font-medium`}>
            对话长度
          </span>
          <div className="flex gap-2">
            <OptionButton
              label="简短"
              selected={dialogLength === "简短"}
              onClick={() => setDialogLength("简短")}
            />
            <OptionButton
              label="详细"
              selected={dialogLength === "详细"}
              onClick={() => setDialogLength("详细")}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-[rgba(155,254,3,0.2)]" />

        {/* 语气倾向 */}
        <div className="flex items-center justify-between px-5 py-4">
          <span className={`text-[#d1d5db] text-sm ${fontBase} font-medium`}>
            语气倾向
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`text-[rgba(155,254,3,0.9)] text-xs ${fontBase}`}>
              幽默偏傲娇
            </span>
            <svg width="6" height="10" viewBox="0 0 15 21.25" fill="none">
              <g filter="url(#filter_arrow)">
                <path
                  d={svgPaths.p2175f400}
                  fill="rgba(155,254,3,0.9)"
                />
              </g>
              <defs>
                <filter
                  colorInterpolationFilters="sRGB"
                  filterUnits="userSpaceOnUse"
                  height="21.25"
                  id="filter_arrow"
                  width="15"
                  x="0"
                  y="0"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    result="hardAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  />
                  <feOffset dy="2.5" />
                  <feGaussianBlur stdDeviation="1.25" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    in2="BackgroundImageFix"
                    mode="normal"
                    result="effect1_dropShadow"
                  />
                  <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow"
                    mode="normal"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-[rgba(155,254,3,0.2)]" />

        {/* 互动性 */}
        <div className="flex items-center justify-between px-5 py-4">
          <span className={`text-[#d1d5db] text-sm ${fontBase} font-medium`}>
            互动性
          </span>
          <div className="flex gap-2">
            <OptionButton
              label="主动引导"
              selected={interactivity === "主动引导"}
              onClick={() => setInteractivity("主动引导")}
            />
            <OptionButton
              label="被动回应"
              selected={interactivity === "被动回应"}
              onClick={() => setInteractivity("被动回应")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Save Button ---
function SaveButton() {
  return (
    <div className="sticky bottom-0 z-10 px-4 pb-5 pt-6 bg-gradient-to-t from-black via-black/95 to-transparent">
      <button
        className={`w-full py-4 rounded-full bg-[rgba(155,254,3,0.9)] text-[#3b3f34] text-lg ${fontBase} font-bold tracking-wider`}
      >
        完成并保存
      </button>
    </div>
  );
}

// --- Main Export ---
export function CreateCharacter() {
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("advanced");

  return (
    <div className="min-h-full bg-black flex flex-col max-w-[480px] mx-auto w-full">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-28 flex flex-col gap-8">
        <PublicStatusSection />
        <TagsSection />
        <DialogueStyleSection />
      </div>
      <SaveButton />
    </div>
  );
}
