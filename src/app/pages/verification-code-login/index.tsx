import { useState, useEffect } from "react";
const svgPaths = {
p1d74be00: "M16.9173 31.0153C24.7033 31.0153 31.0151 24.7035 31.0151 16.9175C31.0151 9.13157 24.7033 2.8198 16.9173 2.8198C9.13137 2.8198 2.8196 9.13157 2.8196 16.9175C2.8196 24.7035 9.13137 31.0153 16.9173 31.0153Z",
p30157300: "M13.9398 31.4809L13.9217 31.4842L13.8049 31.5418L13.772 31.5484L13.749 31.5418L13.6322 31.4842C13.6147 31.4787 13.6015 31.4815 13.5928 31.4924L13.5862 31.5089L13.5582 32.2128L13.5664 32.2457L13.5829 32.2671L13.7539 32.3888L13.7786 32.3954L13.7984 32.3888L13.9694 32.2671L13.9891 32.2408L13.9957 32.2128L13.9678 31.5105C13.9634 31.493 13.9541 31.4831 13.9398 31.4809ZM14.3757 31.2951L14.3543 31.2984L14.05 31.4513L14.0336 31.4678L14.0286 31.4859L14.0582 32.1931L14.0664 32.2128L14.0796 32.2244L14.4102 32.3773C14.431 32.3828 14.4469 32.3784 14.4579 32.3642L14.4645 32.3411L14.4086 31.3313C14.4031 31.3115 14.3921 31.2995 14.3757 31.2951ZM13.1997 31.2984C13.1924 31.294 13.1838 31.2925 13.1755 31.2944C13.1672 31.2962 13.16 31.3012 13.1553 31.3082L13.1454 31.3313L13.0895 32.3411C13.0906 32.3609 13.0999 32.374 13.1174 32.3806L13.1421 32.3773L13.4727 32.2244L13.4891 32.2112L13.4957 32.1931L13.5237 31.4859L13.5187 31.4661L13.5023 31.4497L13.1997 31.2984Z",
p62a9900: "M12.9645 16.4547L21.6865 25.1767C22.1494 25.6395 22.7771 25.8995 23.4316 25.8995C24.0861 25.8995 24.7138 25.6395 25.1767 25.1767C25.6395 24.7139 25.8995 24.0862 25.8995 23.4316C25.8995 22.7771 25.6395 22.1494 25.1767 21.6866L16.4513 12.9645L25.175 4.24249C25.4041 4.01333 25.5858 3.74129 25.7097 3.44191C25.8336 3.14253 25.8974 2.82168 25.8973 2.49767C25.8972 2.17365 25.8333 1.85283 25.7092 1.55351C25.5852 1.25419 25.4034 0.982239 25.1742 0.753181C24.945 0.524124 24.673 0.342447 24.3736 0.218524C24.0742 0.0946003 23.7534 0.0308568 23.4294 0.0309332C23.1054 0.0310095 22.7845 0.0949039 22.4852 0.218969C22.1859 0.343033 21.914 0.524839 21.6849 0.754004L12.9645 9.47604L4.24246 0.754004C4.01499 0.518266 3.74285 0.33019 3.44191 0.200752C3.14098 0.0713131 2.81728 0.00310343 2.4897 0.00010346C2.16212 -0.00289651 1.83722 0.0593727 1.53397 0.183278C1.23071 0.307183 0.955172 0.490243 0.723421 0.721776C0.491669 0.953309 0.30835 1.22868 0.184159 1.53182C0.0599677 1.83496 -0.00260783 2.15979 8.32513e-05 2.48737C0.00277433 2.81495 0.0706779 3.13872 0.199833 3.43977C0.328987 3.74083 0.516806 4.01315 0.75233 4.24085L9.47766 12.9645L0.753975 21.6882C0.518451 21.9159 0.330633 22.1882 0.201478 22.4893C0.0723233 22.7903 0.00441895 23.1141 0.00172787 23.4417C-0.000963212 23.7693 0.0616123 24.0941 0.185803 24.3972C0.309995 24.7004 0.493314 24.9757 0.725065 25.2073C0.956817 25.4388 1.23236 25.6219 1.53561 25.7458C1.83887 25.8697 2.16376 25.932 2.49134 25.929C2.81892 25.926 3.14262 25.8577 3.44356 25.7283C3.74449 25.5989 4.01663 25.4108 4.24411 25.1751L12.9645 16.4547Z",
};
const imgImage = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/verification-code-login/2dfbef3493ddaae489166e016e1a4a78aa729aac.png"));
const imgImage1 = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/verification-code-login/4a0515f093f505d671ec2d74d4010daa50d88b96.png"));
const imgImage2 = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/verification-code-login/b3da50266386b29a46ab5c05f2530974789cc419.png"));
const imgBackground = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/verification-code-login/5002ae40133251c579d54d15ebcf7a815a0bc048.png"));
const DESIGN_W = 750;
const DESIGN_H = 1624;

export default function App() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => setScale(window.innerWidth / DESIGN_W);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: `${DESIGN_H * scale}px`,
        overflow: "hidden",
        background: "#020202",
      }}
    >
      <div
        style={{
          width: `${DESIGN_W}px`,
          height: `${DESIGN_H}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "relative",
          background: "#020202",
          overflow: "hidden",
        }}
      >
        {/* ── Status Bar ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 84,
            display: "flex",
            alignItems: "center",
            padding: "0 50px",
          }}
        >
          {/* Time */}
          <span
            style={{
              color: "#d3d3d3",
              fontSize: 32,
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
              letterSpacing: 0.5,
            }}
          >
            16:38
          </span>

          {/* Right side status icons */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* App notification pill "星野" */}
            <div
              style={{
                background: "#000",
                border: "1.1px solid #090909",
                borderRadius: 22,
                padding: "4px 12px 4px 8px",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <img src={imgImage2} alt="" style={{ width: 32, height: 33, objectFit: "contain" }} />
              <span
                style={{
                  color: "#9c8b64",
                  fontSize: 17,
                  fontFamily: "Microsoft YaHei, sans-serif",
                }}
              >
                星野
              </span>
            </div>

            {/* 5G */}
            <span
              style={{
                color: "#cacaca",
                fontSize: 25,
                fontFamily: "Inter, sans-serif",
              }}
            >
              5G
            </span>

            {/* Signal bars */}
            <img src={imgImage1} alt="" style={{ width: 38, height: 27, objectFit: "contain" }} />

            {/* WiFi / signal icon */}
            <img src={imgImage} alt="" style={{ width: 53, height: 27, objectFit: "contain" }} />
          </div>
        </div>

        {/* ── Close Button ── */}
        <div
          style={{
            position: "absolute",
            top: 114,
            left: 52,
            width: 87,
            height: 87,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(13px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg
            width="26"
            height="32"
            viewBox="0 0 25.8995 32.3955"
            fill="none"
            style={{ display: "block" }}
          >
            <path
              clipRule="evenodd"
              d={svgPaths.p30157300}
              fill="white"
              fillRule="evenodd"
            />
            <path
              clipRule="evenodd"
              d={svgPaths.p62a9900}
              fill="white"
              fillRule="evenodd"
            />
          </svg>
        </div>

        {/* ── Main Content Area ── */}
        <div
          style={{
            position: "absolute",
            top: 255,
            left: 60,
            width: 632,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: 45,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "sans-serif",
              textAlign: "center",
              lineHeight: 1.2,
              width: "100%",
            }}
          >
            欢迎登录 探拾
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 26,
              color: "#666668",
              fontFamily: "Microsoft YaHei, sans-serif",
              width: 460,
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            未注册的手机号验证通过后将自动注册
          </div>

          {/* Spacer */}
          <div style={{ height: 12 }} />

          {/* Phone Number Input */}
          <div
            style={{
              width: 634,
              height: 84,
              background: "#1e1f21",
              borderRadius: 37,
              display: "flex",
              alignItems: "center",
              padding: "0 36px",
              gap: 0,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "#e7e7e7",
                fontSize: 29,
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                marginRight: 20,
              }}
            >
              +86
            </span>
            {/* Divider */}
            <img
              src={imgBackground}
              alt=""
              style={{ width: 1.1, height: 24, objectFit: "cover", marginRight: 20, opacity: 0.6 }}
            />
            <span
              style={{
                color: "#5d5d5f",
                fontSize: 30,
                fontFamily: "Microsoft YaHei, sans-serif",
              }}
            >
              输入手机号码
            </span>
          </div>

          {/* Verification Code Input */}
          <div
            style={{
              width: 627,
              height: 85,
              background: "#1f1e20",
              borderRadius: 42,
              display: "flex",
              alignItems: "center",
              padding: "0 36px",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "#5d5d5f",
                fontSize: 29,
                fontFamily: "Microsoft YaHei, sans-serif",
              }}
            >
              输入验证码
            </span>
            <span
              style={{
                color: "#5c5c5e",
                fontSize: 28,
                fontFamily: "Microsoft YaHei, sans-serif",
              }}
            >
              获取验证码
            </span>
          </div>

          {/* Spacer */}
          <div style={{ height: 60 }} />

          {/* Login Button */}
          <div
            style={{
              width: 627,
              height: 85,
              background: "#528700",
              border: "1.1px solid #4f4736",
              borderRadius: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "#141414",
                fontSize: 30,
                fontWeight: 700,
                fontFamily: "sans-serif",
              }}
            >
              确认登录
            </span>
          </div>
        </div>

        {/* ── Agreement Row ── */}
        <div
          style={{
            position: "absolute",
            top: 849,
            left: 79,
            display: "flex",
            alignItems: "center",
            gap: 17,
          }}
        >
          {/* Circle outline icon */}
          <svg
            width="34"
            height="34"
            viewBox="0 0 33.8346 33.8346"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <clipPath id="clip_circle">
              <rect fill="white" width="33.8346" height="33.8346" />
            </clipPath>
            <g clipPath="url(#clip_circle)">
              <path
                d={svgPaths.p1d74be00}
                stroke="#528700"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4.23"
              />
            </g>
          </svg>

          {/* Text */}
          <div style={{ display: "flex", alignItems: "center", flexWrap: "nowrap" }}>
            <span
              style={{
                color: "#646466",
                fontSize: 22,
                fontFamily: "Microsoft YaHei, sans-serif",
              }}
            >
              已阅读并同意
            </span>
            <span
              style={{
                color: "#ffffff",
                fontSize: 22,
                fontFamily: "sans-serif",
              }}
            >
              《用户协议》
            </span>
            <span
              style={{
                color: "#ffffff",
                fontSize: 22,
                fontFamily: "sans-serif",
              }}
            >
              《隐私政策》
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
