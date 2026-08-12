import bgMain from "@/assets/images/role-chat/427ad222bbfce5fb9c07b0baa60218bc818f04b4.png"
import profileImg from "@/assets/images/role-chat/1b9065390e24a9e786bdf8f3469a3d9fc2bcb035.png"
import avatarImg from "@/assets/images/role-chat/cf19eca6751c6522dab83a346a97ded1df14defa.png"
import badgeImg from "@/assets/images/role-chat/7bc3fec98e76bd4890f46c4fa42374b3d710667b.png"
import backIcon from "@/assets/images/role-chat/9204e8d7ca28edb0cbe6c8c9c67a6f258490955b.png"
import addIcon from "@/assets/images/role-chat/aaec33631e4562c95f1949f70f76aabb916abc55.png"
import calendarIcon from "@/assets/images/role-chat/47b1c9cf1a28958a3c4cf7f0c3063e4d182dc2c0.png"
import moreHeaderIcon from "@/assets/images/role-chat/aa2377cbb5a130016395b04b6df3fd4b35b368a8.png"
import moreArrowIcon from "@/assets/images/role-chat/2b2e47ce42651d7cdaa2bbfce32252622e79daf4.png"
import heartIcon from "@/assets/images/role-chat/b7834b5bb505f286156b48a8c96517713000283f.png"
import refreshIcon from "@/assets/images/role-chat/e6ed360614e7b293f4f50ed92a59f84247151ed8.png"
import thumbIcon from "@/assets/images/role-chat/1656d5868dab3746e7b0475b47926cdf6fe81c32.png"
import moreReactIcon from "@/assets/images/role-chat/55cd2e50098bdffd211a19f5b2267011b1c0017b.png"
import sparkleIcon from "@/assets/images/role-chat/2a843414afc9873acfbf33cfeaebca36fd542be0.png"
import micIcon from "@/assets/images/role-chat/efca57bb491d09098344423336f878bd8dbce32e.png"
import bulbIcon from "@/assets/images/role-chat/a9758cb76131a172e87f8620cb97e118ce4d2a1f.png"
import plusIcon from "@/assets/images/role-chat/c5f79ad3bcee3a3bec6dd6f13bcaa92148519ba9.png"
import dotIcon from "@/assets/images/role-chat/7e9fd1523826d7f275a20ba94dd88076a8a1926d.png"

export default function App() {
  return (
    <div className="relative mx-auto flex min-h-full w-full max-w-[430px] flex-col overflow-hidden bg-black text-white">
      {/* Full-bleed background illustration */}
      <img
        src={bgMain}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/70"
      />

      {/* Header */}
      <header className="relative z-10 flex items-center gap-3 px-3 pt-4 pb-2">
        <button className="flex size-9 shrink-0 items-center justify-center" aria-label="返回">
          <img src={backIcon} alt="" className="h-5 w-3 object-contain" />
        </button>

        <div className="flex flex-1 items-center gap-2 rounded-full border border-white/15 bg-black/25 py-1 pl-1 pr-3 backdrop-blur-sm">
          <div className="relative shrink-0">
            <img src={avatarImg} alt="陆沉" className="size-11 rounded-full object-cover" />
            <span className="absolute -bottom-0.5 -right-0.5 block size-3 rounded-full border-2 border-black/60 bg-green-400" />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-1">
              <span className="truncate text-[15px] font-medium text-white/90">陆沉</span>
              <img src={badgeImg} alt="" className="size-3.5 object-contain" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-md bg-[#1f2536] px-1.5 py-0.5 text-[10px] text-[#606d8f]">温柔学长</span>
              <span className="rounded-md bg-[#202637] px-1.5 py-0.5 text-[10px] text-[#606d8e]">音乐人</span>
            </div>
          </div>
          <button className="ml-auto flex size-8 shrink-0 items-center justify-center" aria-label="添加">
            <img src={addIcon} alt="" className="h-5 w-6 object-contain" />
          </button>
        </div>

        <button className="flex size-9 shrink-0 items-center justify-center" aria-label="日历">
          <img src={calendarIcon} alt="" className="h-5 w-5 object-contain" />
        </button>
        <button className="flex size-9 shrink-0 items-center justify-center" aria-label="更多">
          <img src={moreHeaderIcon} alt="" className="h-5 w-5 object-contain" />
        </button>
      </header>

      {/* Chat scroll area */}
      <main className="relative z-10 flex flex-1 flex-col gap-5 overflow-y-auto px-4 pt-2 pb-4">
        {/* Profile intro card */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10">
          <img src={profileImg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative flex flex-col items-center gap-5 px-6 py-7 text-center">
            <p className="text-[15px] leading-7 text-[#adadaf]">
              大四学生，音乐制作人，温柔体贴，
              <br />
              总能在细节处照顾到你。
            </p>
            <p className="text-[15px] leading-7 text-[#a8a8ab]">
              喜欢深夜的钢琴声，也喜欢和你分享
              <br />
              生活的点滴。
            </p>
            <button className="flex items-center gap-1.5 self-end rounded-full border border-[#39373f] bg-[#25242b] px-3 py-1.5 text-xs text-[#afaeaf]">
              了解更多
              <img src={moreArrowIcon} alt="" className="h-2.5 w-1.5 object-contain" />
            </button>
          </div>
        </section>

        {/* Timestamp */}
        <div className="text-center text-xs text-[#ab9998]">今天 21:36</div>

        {/* Outgoing message */}
        <div className="flex flex-col items-end gap-1">
          <div className="rounded-3xl border-2 border-[#72639f] bg-[#433e69] px-5 py-3.5 text-[15px] text-[#e6e4f0]">
            今天过得怎么样呀？
          </div>
          <span className="pr-1 text-[11px] text-[#818281]">已读</span>
        </div>

        {/* Incoming message */}
        <div className="flex flex-col items-start gap-2">
          <div className="max-w-[85%] rounded-3xl border border-[#2e2e31] bg-[#131416]/95 px-5 py-4">
            <p className="text-[15px] leading-7 text-[#b2b2b2]">
              有你问我，我的一天就很不错。
              <br />
              今天在工作室完成了一首新曲，
              <br />
              灵感来自你上次随口哼的旋律。
              <br />
              晚上本来想早点休息，结果又忍不住想和你聊聊天了。
            </p>
            <p className="mt-2 text-[15px] leading-7 text-[#a8a8a8]">你呢？今天有没有想我一点点？</p>
          </div>
          <div className="flex items-center gap-4 pl-2">
            <img src={heartIcon} alt="喜欢" className="h-5 w-6 object-contain" />
            <img src={refreshIcon} alt="重新生成" className="h-5 w-5 object-contain" />
            <img src={thumbIcon} alt="赞" className="h-5 w-5 object-contain" />
            <img src={moreReactIcon} alt="更多" className="h-5 w-5 object-contain" />
          </div>
        </div>
      </main>

      {/* Input bar */}
      <footer className="relative z-10 flex items-center gap-2 px-3 pb-5 pt-2">
        <button className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5" aria-label="灵感">
          <img src={sparkleIcon} alt="" className="h-6 w-6 object-contain" />
        </button>
        <div className="flex flex-1 items-center gap-3 rounded-full bg-[#48464c] px-4 py-3">
          <img src={micIcon} alt="" className="h-5 w-4 shrink-0 object-contain" />
          <input
            className="min-w-0 flex-1 bg-transparent text-[15px] text-[#c9c7cd] placeholder:text-[#807d83] focus:outline-none"
            placeholder="发送消息给林梦"
          />
          <img src={bulbIcon} alt="" className="h-6 w-5 shrink-0 object-contain" />
          <button className="relative shrink-0" aria-label="更多">
            <img src={plusIcon} alt="" className="h-7 w-7 object-contain" />
            <img src={dotIcon} alt="" className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 object-contain" />
          </button>
        </div>
      </footer>
    </div>
  )
}
