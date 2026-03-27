import { useState, useEffect } from 'react';
const imgLogo = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/quick-login2/90f25c18173d84eb141626510c0e827da8d09d68.png"));
const imgBgCircle = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/quick-login2/3b2927c9d71319d23c90e60279151a76038012e0.png"));
const svgPaths = {
p1c5e8800: "M17.9041 33.6936C26.6244 33.6936 33.6936 26.6244 33.6936 17.9041C33.6936 9.18385 26.6244 2.11466 17.9041 2.11466C9.18385 2.11466 2.11466 9.18385 2.11466 17.9041C2.11466 26.6244 9.18385 33.6936 17.9041 33.6936Z",
p30157300: "M13.9398 31.4809L13.9217 31.4842L13.8049 31.5418L13.772 31.5484L13.749 31.5418L13.6322 31.4842C13.6147 31.4787 13.6015 31.4815 13.5928 31.4924L13.5862 31.5089L13.5582 32.2128L13.5664 32.2457L13.5829 32.2671L13.7539 32.3888L13.7786 32.3954L13.7984 32.3888L13.9694 32.2671L13.9891 32.2408L13.9957 32.2128L13.9678 31.5105C13.9634 31.493 13.9541 31.4831 13.9398 31.4809ZM14.3757 31.2951L14.3543 31.2984L14.05 31.4513L14.0336 31.4678L14.0286 31.4859L14.0582 32.1931L14.0664 32.2128L14.0796 32.2244L14.4102 32.3773C14.431 32.3828 14.4469 32.3784 14.4579 32.3642L14.4645 32.3411L14.4086 31.3313C14.4031 31.3115 14.3921 31.2995 14.3757 31.2951ZM13.1997 31.2984C13.1924 31.294 13.1838 31.2925 13.1755 31.2944C13.1672 31.2962 13.16 31.3012 13.1553 31.3082L13.1454 31.3313L13.0895 32.3411C13.0906 32.3609 13.0999 32.374 13.1174 32.3806L13.1421 32.3773L13.4727 32.2244L13.4891 32.2112L13.4957 32.1931L13.5237 31.4859L13.5187 31.4661L13.5023 31.4497L13.1997 31.2984Z",
p62a9900: "M12.9645 16.4547L21.6865 25.1767C22.1494 25.6395 22.7771 25.8995 23.4316 25.8995C24.0861 25.8995 24.7138 25.6395 25.1767 25.1767C25.6395 24.7139 25.8995 24.0862 25.8995 23.4316C25.8995 22.7771 25.6395 22.1494 25.1767 21.6866L16.4513 12.9645L25.175 4.24249C25.4041 4.01333 25.5858 3.74129 25.7097 3.44191C25.8336 3.14253 25.8974 2.82168 25.8973 2.49767C25.8972 2.17365 25.8333 1.85283 25.7092 1.55351C25.5852 1.25419 25.4034 0.982239 25.1742 0.753181C24.945 0.524124 24.673 0.342447 24.3736 0.218524C24.0742 0.0946003 23.7534 0.0308568 23.4294 0.0309332C23.1054 0.0310095 22.7845 0.0949039 22.4852 0.218969C22.1859 0.343033 21.914 0.524839 21.6849 0.754004L12.9645 9.47604L4.24246 0.754004C4.01499 0.518266 3.74285 0.33019 3.44191 0.200752C3.14098 0.0713131 2.81728 0.00310343 2.4897 0.00010346C2.16212 -0.00289651 1.83722 0.0593727 1.53397 0.183278C1.23071 0.307183 0.955172 0.490243 0.723421 0.721776C0.491669 0.953309 0.30835 1.22868 0.184159 1.53182C0.0599677 1.83496 -0.00260783 2.15979 8.32513e-05 2.48737C0.00277433 2.81495 0.0706779 3.13872 0.199833 3.43977C0.328987 3.74083 0.516806 4.01315 0.75233 4.24085L9.47766 12.9645L0.753975 21.6882C0.518451 21.9159 0.330633 22.1882 0.201478 22.4893C0.0723233 22.7903 0.00441895 23.1141 0.00172787 23.4417C-0.000963212 23.7693 0.0616123 24.0941 0.185803 24.3972C0.309995 24.7004 0.493314 24.9757 0.725065 25.2073C0.956817 25.4388 1.23236 25.6219 1.53561 25.7458C1.83887 25.8697 2.16376 25.932 2.49134 25.929C2.81892 25.926 3.14262 25.8577 3.44356 25.7283C3.74449 25.5989 4.01663 25.4108 4.24411 25.1751L12.9645 16.4547Z",
};

const DESIGN_W = 750;
const DESIGN_H = 1622.932;

export default function App() {
  const [scale, setScale] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth / DESIGN_W : 1
  );

  useEffect(() => {
    const update = () => setScale(window.innerWidth / DESIGN_W);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: `${DESIGN_H * scale}px`,
        overflow: 'hidden',
        background: 'black',
      }}
    >
      <div
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'relative',
          background: 'black',
          overflow: 'hidden',
        }}
      >
        {/* ── Close button ── */}
        <div
          style={{
            position: 'absolute',
            top: 52.967,
            left: 54.38,
            width: 86.755,
            height: 86.755,
            borderRadius: '50%',
            backdropFilter: 'blur(13px)',
            WebkitBackdropFilter: 'blur(13px)',
            backgroundColor: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg
            width="27"
            height="32"
            viewBox="0 0 25.8995 32.3955"
            fill="none"
          >
            <path
              clipRule="evenodd"
              d={svgPaths.p62a9900}
              fill="white"
              fillRule="evenodd"
            />
          </svg>
        </div>

        {/* ── Logo Group (magnifying glass + 探拾) ── */}
        <div
          style={{
            position: 'absolute',
            top: 383.454,
            left: 275.192,
            width: 197.368,
            height: 285.338,
          }}
        >
          {/* Background glow circle */}
          <div
            style={{
              position: 'absolute',
              left: 2.31,
              top: -27.49,
              width: 200,
              height: 200,
              borderRadius: '50%',
              overflow: 'hidden',
            }}
          >
            <img
              src={imgBgCircle}
              alt=""
              style={{
                position: 'absolute',
                left: '-15%',
                top: '-15%',
                width: '130%',
                height: '130%',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Magnifying glass logo */}
          <img
            src={imgLogo}
            alt=""
            style={{
              position: 'absolute',
              top: 11.273,
              left: 20.301,
              width: 156.767,
              height: 256.015,
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />

          {/* 探拾 text */}
          <div
            style={{
              position: 'absolute',
              top: 172.55,
              left: 31.577,
              width: 140.977,
              height: 91.353,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 69.925,
              fontWeight: 'bold',
              color: 'white',
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              letterSpacing: 2,
              zIndex: 2,
            }}
          >
            探拾
          </div>
        </div>

        {/* ── 本机号码 label ── */}
        <div
          style={{
            position: 'absolute',
            top: 972.181,
            left: 309.02,
            width: 120.677,
            height: 41.729,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#828286',
            fontSize: 29.323,
            fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
          }}
        >
          本机号码
        </div>

        {/* ── Phone number: 147****7554 ── */}
        <div
          style={{
            position: 'absolute',
            top: 1048.868,
            left: 236.84,
            display: 'flex',
            alignItems: 'baseline',
          }}
        >
          <span
            style={{
              color: '#c2c3c5',
              fontSize: 42.857,
              fontFamily: 'Inter, "SF Pro Display", sans-serif',
              fontWeight: 600,
            }}
          >
            147****
          </span>
          <span
            style={{
              color: '#d1d1d3',
              fontSize: 43.985,
              fontFamily: 'Inter, "SF Pro Display", sans-serif',
              fontWeight: 600,
            }}
          >
            7554
          </span>
        </div>

        {/* ── Green primary button: 一键登录 ── */}
        <div
          style={{
            position: 'absolute',
            top: 1163.913,
            left: 56.388,
            width: 634.962,
            height: 93.609,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 625.94,
              height: 83.459,
              backgroundColor: '#9bfe03',
              borderRadius: 39.474,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                fontSize: 33.835,
                fontWeight: 'bold',
                color: 'black',
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              }}
            >
              一键登录
            </span>
          </div>
        </div>

        {/* ── Dark secondary button: 其他手机号登录 ── */}
        <div
          style={{
            position: 'absolute',
            top: 1281.2,
            left: 56.39,
            width: 636.09,
            height: 91.352,
            backgroundColor: '#28292d',
            borderRadius: 41.729,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              fontSize: 30.451,
              color: '#b2b3b6',
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
            }}
          >
            其他手机号登录
          </span>
        </div>

        {/* ── Agreement section ── */}
        <div
          style={{
            position: 'absolute',
            top: 1437.972,
            left: 73.304,
            width: 586.466,
            height: 77.82,
          }}
        >
          {/* Circle checkbox */}
          <div
            style={{
              position: 'absolute',
              left: 20.3,
              top: 8,
            }}
          >
            <svg
              viewBox="0 0 35.8083 35.8083"
              fill="none"
              width={31.57}
              height={31.57}
            >
              <path
                d={svgPaths.p1c5e8800}
                stroke="#528700"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4.22932"
              />
            </svg>
          </div>

          {/* Row 1: 已阅读并同意 + 《用户服务协议》《用户隐私政策》 */}
          <div
            style={{
              position: 'absolute',
              top: 7.891,
              left: 65.416,
              height: 31.579,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 22.556,
                color: '#67686c',
                fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
              }}
            >
              已阅读并同意
            </span>
            <span
              style={{
                fontSize: 21.429,
                color: '#9c9da1',
                fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
              }}
            >
              《用户服务协议》《用户隐私政策》
            </span>
          </div>

          {/* Row 2: 《中国移动认证服务条款》 */}
          <div
            style={{
              position: 'absolute',
              top: 41.729,
              left: 190.606,
              width: 259.398,
              height: 29.323,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 21.429,
              color: '#9a9b9f',
              fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
            }}
          >
            《中国移动认证服务条款》
          </div>
        </div>
      </div>
    </div>
  );
}