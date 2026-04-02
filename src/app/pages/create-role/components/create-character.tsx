import { useState } from "react";
import { ScrollView } from "react-native";
import { AiHeader } from "@/components/ai-company/ai-header";
import { AiTopTabs } from "@/components/ai-company/ai-top-tabs";
import { AiSwitch } from "@/components/ai-company/ai-switch";
import { BasicInfoSection } from "./basic-info";
const imgSparkle = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/create-role/sparkle.svg"));
const imgPlusGray = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/create-role/plus_gray.svg"));
const imgChevronRightGreen = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/create-role/chevron_right_green.svg"));

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
      <AiHeader title="创建角色" className="mb-4" />
      <AiTopTabs
        tabs={[
          { id: "basic", label: "基础信息" },
          { id: "advanced", label: "高级设定" },
        ]}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
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
        <AiSwitch checked={isPublic} onCheckedChange={setIsPublic} />
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
          <img src={imgSparkle} alt="" className="w-[14px] h-[14px] object-contain shrink-0" />
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
            <img src={imgPlusGray} alt="" className="w-[16px] h-[16px] object-contain" />
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
            <img src={imgChevronRightGreen} alt="" className="w-[6px] h-[10px] object-contain" />
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
    <div className="h-full bg-black flex flex-col max-w-[480px] mx-auto w-full">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 112 }}>
        <div className="px-4 pt-5 flex flex-col gap-8">
          {activeTab === "advanced" ? (
            <>
              <PublicStatusSection />
              <TagsSection />
              <DialogueStyleSection />
            </>
          ) : (
            <BasicInfoSection />
          )}
        </div>
      </ScrollView>
      <SaveButton />
    </div>
  );
}
