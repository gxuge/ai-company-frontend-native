const imgAvatar = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/browse-images-list/f237e684d01d55d9ec3a722678f8a240c02ceb8b.png"));
const imgEye = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/browse-images-list/26c770612af2df2377f95228e63007b26e0e21bd.png"));
const imgMain = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/browse-images-list/43a96fc9c5b518385cdb7450c72740a4259ee56b.png"));
interface ImageCardProps {
  username?: string;
  author?: string;
  views?: string;
}

export function ImageCard({
  username = "@每个ai为..",
  author = "kerwin壳壳",
  views = "76.4万",
}: ImageCardProps) {
  return (
    <div className="relative rounded-[12px] overflow-hidden">
      {/* Main image */}
      <img
        src={imgMain}
        alt=""
        className="w-full aspect-[2/3] object-cover"
      />

      {/* Username tag - top left */}
      <div className="absolute top-2 left-2 backdrop-blur-[3.8px] bg-[rgba(0,0,0,0.3)] px-2 py-0.5 rounded-full shadow-sm">
        <span className="text-[rgba(255,255,255,0.9)] text-[11px]" style={{ fontWeight: 500 }}>
          {username}
        </span>
      </div>

      {/* Bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 backdrop-blur-[10px] bg-gradient-to-b from-transparent via-[rgba(141,141,141,0.5)] to-white rounded-b-[12px] px-2.5 pt-3 pb-2.5 flex items-center justify-between">
        {/* Author info */}
        <div className="flex items-center gap-1.5">
          <img
            src={imgAvatar}
            alt=""
            className="w-[18px] h-[18px] rounded-full object-cover"
          />
          <span className="text-[#cec1b4] text-[8px]" style={{ fontWeight: 700 }}>
            {author}
          </span>
        </div>

        {/* Views */}
        <div className="flex items-center gap-1">
          <img src={imgEye} alt="" className="w-[14px] h-[10px] object-cover" />
          <span className="text-[#bfbcbd] text-[11px]">{views}</span>
        </div>
      </div>
    </div>
  );
}
