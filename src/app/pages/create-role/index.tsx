import { useState } from "react";
const svgPaths = {
p1764b200: "M22.2792 7.97156L23.3204 5.72355L25.5866 4.71786C26.1378 4.54039 26.1378 3.83049 25.5866 3.59386L23.3204 2.58817L22.2792 0.399317C22.0342 -0.133106 21.3604 -0.133106 21.1154 0.399317L20.0742 2.58817L17.7468 3.59386C17.2568 3.83049 17.2568 4.48123 17.7468 4.71786L20.0742 5.72355L21.1154 7.97156C21.2992 8.44482 22.0342 8.44482 22.2792 7.97156ZM11.8669 9.86462L9.78445 5.42776C9.35571 4.42207 7.88575 4.42207 7.45701 5.42776L5.37456 9.86462L0.780919 11.876C-0.260306 12.2901 -0.260306 13.7099 0.780919 14.124L5.37456 16.1354L7.45701 20.5722C7.88575 21.5779 9.35571 21.5779 9.78445 20.5722L11.8669 16.1354L16.4605 14.124C17.5018 13.7099 17.5018 12.2901 16.4605 11.876L11.8669 9.86462ZM21.1154 18.0284L20.0742 20.2765L17.7468 21.2821C17.2568 21.4596 17.2568 22.1695 17.7468 22.4061L20.0742 23.4118L21.1154 25.6007C21.2992 26.1331 22.0342 26.1331 22.2792 25.6007L23.3204 23.4118L25.5866 22.4061C26.1378 22.1695 26.1378 21.5188 25.5866 21.2821L23.3204 20.2765L22.2792 18.0284C22.0342 17.5552 21.2992 17.5552 21.1154 18.0284Z",
p2f924600: "M29.3419 15.3994H10.3327L17.3915 8.36998L15.4161 6.38618L4.95811 16.8008L15.4161 27.214L17.3915 25.2302L10.3299 18.1994H29.3419V15.3994Z",
p3e0e0c80: "M17.6001 9.86751L17.5072 9.8112C16.4542 9.17072 15.528 8.60625 14.7341 8.3219C14.2964 8.1537 13.8285 8.07843 13.3602 8.1009C12.8672 8.13853 12.396 8.31958 12.0046 8.62173C11.1896 9.23266 10.8377 10.1322 10.6448 11.1274C10.4576 12.0916 10.3858 13.3472 10.2971 14.876L10.2929 14.9548C10.2394 15.8698 10.2056 16.7749 10.2056 17.5956C10.2056 18.4162 10.2394 19.3227 10.2929 20.2377L10.2971 20.3151C10.3858 21.8439 10.4576 23.0995 10.6448 24.0623C10.8377 25.059 11.1896 25.957 12.0046 26.5694C12.4072 26.872 12.8591 27.0522 13.3602 27.0902C13.8416 27.1254 14.3033 27.024 14.7341 26.8692C15.528 26.5849 16.4542 26.0204 17.5072 25.3813L17.6001 25.325C18.1997 24.959 18.7881 24.5832 19.3132 24.213C19.9562 23.7555 20.583 23.2757 21.1924 22.7743L21.2628 22.7166C22.3382 21.8396 23.2504 21.095 23.881 20.363C24.568 19.5606 24.986 18.6992 24.986 17.5956C24.986 16.4919 24.568 15.6291 23.8796 14.8281C23.2504 14.0961 22.3382 13.3501 21.2642 12.4745L21.1938 12.4168C20.5547 11.8959 19.9128 11.3976 19.3132 10.9782C18.754 10.5895 18.1827 10.2187 17.6001 9.8661",
p520f1f0: "M4.68206 0.655462C3.77265 1.52941 3.77265 3.05882 4.68206 3.93277L14.1172 13L4.68206 22.0672C3.77265 22.9412 3.77265 24.4706 4.68206 25.3445C5.70515 26.2185 7.18295 26.2185 8.09236 25.3445L19.2327 14.6387C20.2558 13.7647 20.2558 12.2353 19.2327 11.3613L8.09236 0.655462C7.18295 -0.218487 5.70515 -0.218487 4.68206 0.655462Z",
};

type Tab = "basic" | "advanced";
type Gender = "male" | "female" | "random";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("advanced");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [job, setJob] = useState("");
  const [background, setBackground] = useState("");

  return (
    <div className="bg-black min-h-screen w-full font-['Noto_Sans_SC',sans-serif] text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="relative flex items-center justify-center h-16 px-4">
          <button className="absolute left-4 bg-[#232322] rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-md">
            <svg width="20" height="20" viewBox="0 0 35 33.6" fill="none">
              <path clipRule="evenodd" d={svgPaths.p2f924600} fill="white" fillRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-lg text-white">创建角色</h1>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pb-3">
          <div className="bg-black border border-[rgba(155,254,3,0.3)] rounded-full flex p-1.5">
            <button
              onClick={() => setActiveTab("basic")}
              className={`flex-1 py-2.5 rounded-full text-sm transition-all ${
                activeTab === "basic"
                  ? "bg-[rgba(155,254,3,0.9)] text-[#3b3f34]"
                  : "text-[#9ca3af]"
              }`}
            >
              基础信息
            </button>
            <button
              onClick={() => setActiveTab("advanced")}
              className={`flex-1 py-2.5 rounded-full text-sm transition-all ${
                activeTab === "advanced"
                  ? "bg-[rgba(155,254,3,0.9)] text-[#3b3f34]"
                  : "text-[#9ca3af]"
              }`}
            >
              高级设定
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pt-5 pb-32 space-y-8">
        {/* Section: 角色设定 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base text-white tracking-wide">
              角色设定 <span className="text-[rgba(155,254,3,0.9)]">*</span>
            </h2>
            <AutoGenButton />
          </div>

          <div className="bg-black border border-[#494949] rounded-2xl p-5 space-y-5">
            {/* 角色名字 */}
            <div className="space-y-3">
              <FieldLabel text="角色名字" required />
              <input
                type="text"
                placeholder="输入角色名字"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border border-[#494949] rounded-lg px-[13px] py-[13px] text-sm text-white placeholder-[#6b7280] outline-none focus:border-[rgba(155,254,3,0.5)] transition-colors"
              />
            </div>

            {/* 性别 */}
            <div className="space-y-3">
              <FieldLabel text="性别" />
              <div className="bg-[#0c0c0c] border border-[rgba(255,255,255,0.3)] rounded-lg flex p-1.5">
                {(["male", "female", "random"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-2 rounded-[5px] text-sm transition-all ${
                      gender === g
                        ? "bg-[rgba(155,254,3,0.2)] text-[#9bfe03]"
                        : "text-[#9ca3af]"
                    }`}
                  >
                    {g === "male" ? "男生" : g === "female" ? "女生" : "随机"}
                  </button>
                ))}
              </div>
            </div>

            {/* 职业 */}
            <div className="space-y-3">
              <FieldLabel text="职业" />
              <input
                type="text"
                placeholder="输入角色职业"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className="w-full bg-transparent border border-[#494949] rounded-lg px-[13px] py-[13px] text-sm text-white placeholder-[#6b7280] outline-none focus:border-[rgba(155,254,3,0.5)] transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Section: 角色背景设定 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base text-white tracking-wide">角色背景设定</h2>
            <AutoGenButton />
          </div>

          <div className="bg-black border border-[#494949] rounded-[16px] p-4">
            <textarea
              placeholder="输入角色背景故事，可辅助生成人设和剧情。"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-[#6b7280] outline-none resize-none h-[120px]"
            />
          </div>
        </section>

        {/* Section: 角色声音 */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-base text-white tracking-wide">角色声音</h2>
          </div>

          <button className="w-full bg-black border border-[#494949] rounded-[16px] p-4 flex items-center justify-between">
            <span className="text-sm text-[#9ca3af]">选择角色声音</span>
            <div className="flex items-center gap-2.5">
              <span className="text-sm text-[rgba(155,254,3,0.9)]">温柔男声</span>
              <div className="bg-[rgba(155,254,3,0.2)] rounded-full w-8 h-8 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 33.78 33.78" fill="none">
                  <path d={svgPaths.p3e0e0c80} fill="rgba(155,254,3,0.9)" />
                </svg>
              </div>
              <svg width="10" height="16" viewBox="0 0 24 26" fill="none">
                <path d={svgPaths.p520f1f0} fill="white" />
              </svg>
            </div>
          </button>
        </section>
      </main>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent px-4 pt-8 pb-8">
        <button className="w-full bg-[rgba(155,254,3,0.9)] text-[#3b3f34] py-4 rounded-full text-base tracking-wider">
          完成创建
        </button>
      </div>
    </div>
  );
}

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <div className="flex items-center border-l-2 border-[rgba(155,254,3,0.9)] pl-3">
      <span className="text-sm text-white">
        {text} {required && <span className="text-[rgba(155,254,3,0.9)]">*</span>}
      </span>
    </div>
  );
}

function AutoGenButton() {
  return (
    <button className="flex items-center gap-2 border border-[rgba(155,254,3,0.2)] rounded-full px-4 py-2 shadow-[0_0_10px_rgba(155,254,3,0.2),0_0_20px_rgba(155,254,3,0.1)]">
      <svg width="14" height="14" viewBox="0 0 26 26" fill="none">
        <path d={svgPaths.p1764b200} fill="rgba(155,254,3,0.9)" />
      </svg>
      <span className="text-xs text-[rgba(155,254,3,0.9)]">一键生成</span>
    </button>
  );
}