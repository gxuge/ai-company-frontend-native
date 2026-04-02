import React, { useState } from "react";
import { router } from "expo-router";
import { AiSelectTab } from "@/components/ai-company/ai-select-tab";
import { AiFormInput } from "@/components/ai-company/ai-form-input";
const imgSparkle = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/create-role/sparkle.svg"));
const imgPlay = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/create-role/play.svg"));
const imgChevronRight = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/create-role/chevron_right.svg"));
const imgAddImage = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/create-role/add-image.svg"));

type Gender = "male" | "female" | "random";

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <div className="flex items-center border-l-2 border-[rgba(155,254,3,0.9)] pl-2">
      <span className="text-xs text-white">
        {text} {required && <span className="text-[rgba(155,254,3,0.9)]">*</span>}
      </span>
    </div>
  );
}

function AutoGenButton() {
  return (
    <button className="flex items-center gap-2 border border-[rgba(155,254,3,0.2)] rounded-full px-4 py-2 shadow-[0_0_10px_rgba(155,254,3,0.2),0_0_20px_rgba(155,254,3,0.1)]">
      <img src={imgSparkle} alt="" className="w-[14px] h-[14px] object-contain shrink-0" />
      <span className="text-xs text-[rgba(155,254,3,0.9)]">一键生成</span>
    </button>
  );
}

export function BasicInfoSection() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [job, setJob] = useState("");
  const [background, setBackground] = useState("");
  
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Section: 角色设定 */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 w-full mb-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm text-white tracking-wide">
              角色形象 <span className="text-[rgba(155,254,3,0.9)]">*</span>
            </h2>
            <AutoGenButton />
          </div>

          <button 
            onClick={() => router.push('/pages/create-character')}
            className="bg-black border-[1.5px] border-dashed border-[rgba(155,254,3,0.5)] rounded-2xl flex flex-col items-center justify-center py-10 w-full active:opacity-80"
          >
            <div className="border border-[rgba(155,254,3,0.3)] rounded-full flex items-center justify-center w-[46px] h-[46px] mb-3">
              <img src={imgAddImage} alt="" className="w-4 h-4 object-contain" />
            </div>
            <span className="text-[#a1a1aa] text-xs font-medium">点击添加角色形象</span>
          </button>
        </div>

        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm text-white tracking-wide">
            角色设定 <span className="text-[rgba(155,254,3,0.9)]">*</span>
          </h2>
          <AutoGenButton />
        </div>

        <div className="bg-black border border-[#494949] rounded-xl p-4 space-y-4">
          {/* 角色名字 */}
          <div className="space-y-2">
            <FieldLabel text="角色名字" required />
            <AiFormInput
              placeholder="输入角色名字"
              value={name}
              onChangeText={setName}
            />
          </div>

          {/* 性别 */}
          <div className="space-y-2">
            <FieldLabel text="性别" />
            <AiSelectTab
              options={[
                { label: "男生", value: "male" },
                { label: "女生", value: "female" },
                { label: "随机", value: "random" },
              ]}
              value={gender}
              onChange={setGender}
            />
          </div>

          {/* 职业 */}
          <div className="space-y-2">
            <FieldLabel text="职业" />
            <AiFormInput
              placeholder="输入角色职业"
              value={job}
              onChangeText={setJob}
            />
          </div>
        </div>
      </section>

      {/* Section: 角色背景设定 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm text-white tracking-wide">角色背景设定</h2>
          <AutoGenButton />
        </div>

        <div className="bg-black border border-[#494949] rounded-xl p-3">
          <textarea
            placeholder="输入角色背景故事，可辅助生成人设和剧情。"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-[#6b7280] outline-none resize-none h-[110px]"
          />
        </div>
      </section>

      {/* Section: 角色声音 */}
      <section className="space-y-3 mb-6">
        <div className="px-1">
          <h2 className="text-sm text-white tracking-wide">角色声音</h2>
        </div>

        <button className="w-full bg-black border border-[#494949] rounded-xl p-3 flex items-center justify-between">
          <span className="text-xs text-[#9ca3af]">选择角色声音</span>
          <div className="flex items-center gap-2">
          <span className="text-xs text-[rgba(155,254,3,0.9)]">温柔男声</span>
          <div className="bg-[rgba(155,254,3,0.2)] rounded-full w-8 h-8 flex items-center justify-center">
              <img src={imgPlay} alt="" className="w-[18px] h-[18px] object-contain" />
            </div>
            <img src={imgChevronRight} alt="" className="w-[10px] h-[16px] object-contain" />
          </div>
        </button>
      </section>
    </div>
  );
}
