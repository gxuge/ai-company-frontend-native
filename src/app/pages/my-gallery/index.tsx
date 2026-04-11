import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Image as ImageIcon, Check, Trash2 } from 'lucide-react';

// Mock gallery data
const initialImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop', name: '时尚女孩_参考01', type: '参考图' },
  { id: 2, url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop', name: '商务男士_生成', type: '生成图' },
  { id: 3, url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop', name: '优雅女性_收藏', type: '收藏图' },
  { id: 4, url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop', name: '职业造型_参考02', type: '参考图' },
  { id: 5, url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop', name: '都市风格_生成', type: '生成图' },
  { id: 6, url: 'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=400&h=500&fit=crop', name: '清新女孩_收藏', type: '收藏图' },
];

export default function App() {
  const [images, setImages] = useState(initialImages);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<number[]>([]);

  const handleImageSelect = (id: number) => {
    if (isManageMode) {
      setSelectedForDelete(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else {
      setSelectedImage(selectedImage === id ? null : id);
    }
  };

  const handleUseImage = () => {
    console.log('Using image:', selectedImage);
    // Return to previous page with selected image
  };

  const handleDelete = () => {
    setImages(prev => prev.filter(img => !selectedForDelete.includes(img.id)));
    setSelectedForDelete([]);
    setIsManageMode(false);
  };

  const handleToggleManage = () => {
    setIsManageMode(!isManageMode);
    setSelectedForDelete([]);
    setSelectedImage(null);
  };

  // Empty State
  if (images.length === 0) {
    return (
      <div className="dark min-h-screen bg-gradient-to-b from-black to-zinc-950 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/50">
          <button className="p-2 -ml-2 hover:bg-zinc-800/30 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-100" />
          </button>
          <h1 className="text-zinc-100">我的图库</h1>
          <div className="w-9" /> {/* Spacer */}
        </header>

        {/* Empty State Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-zinc-900/80 border border-zinc-800/50 flex items-center justify-center mb-6">
              <ImageIcon className="w-9 h-9 text-zinc-600" strokeWidth={1.5} />
            </div>

            <h2 className="text-zinc-200 mb-2">你还没有图片</h2>
            <p className="text-zinc-500 mb-8 max-w-[280px] leading-relaxed">
              上传参考图或保存生成结果后，会显示在这里
            </p>

            <button className="px-6 py-3 bg-emerald-500/90 hover:bg-emerald-500 text-black rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]">
              返回创建人物
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Gallery State
  return (
    <div className="dark min-h-screen bg-gradient-to-b from-black to-zinc-950 flex flex-col pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="flex items-center justify-between px-5 py-4">
          <button className="p-2 -ml-2 hover:bg-zinc-800/30 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-100" />
          </button>
          <h1 className="text-zinc-100">我的图库</h1>
          <button
            onClick={handleToggleManage}
            className={`transition-colors ${
              isManageMode ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {isManageMode ? '完成' : '管理'}
          </button>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="flex-1 px-4 pt-6">
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="flex flex-col gap-2"
            >
              {/* Image Card */}
              <div
                onClick={() => handleImageSelect(image.id)}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group"
              >
                {/* Image */}
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Normal Selection State (not in manage mode) */}
                <AnimatePresence>
                  {!isManageMode && selectedImage === image.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      {/* Glow Border */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4),inset_0_0_20px_rgba(52,211,153,0.1)]" />

                      {/* Check Mark */}
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-emerald-400 flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-black" strokeWidth={3} />
                      </div>

                      {/* Subtle overlay */}
                      <div className="absolute inset-0 bg-emerald-400/5" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delete Selection State (in manage mode) */}
                <AnimatePresence>
                  {isManageMode && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-3 right-3"
                    >
                      <div
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          selectedForDelete.includes(image.id)
                            ? 'bg-red-500 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                            : 'bg-black/40 border-zinc-600 backdrop-blur-sm'
                        }`}
                      >
                        {selectedForDelete.includes(image.id) && (
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Border when not selected */}
                {!isManageMode && selectedImage !== image.id && (
                  <div className="absolute inset-0 rounded-2xl border border-zinc-800/50" />
                )}
                {isManageMode && !selectedForDelete.includes(image.id) && (
                  <div className="absolute inset-0 rounded-2xl border border-zinc-800/50" />
                )}
              </div>

              {/* Image Name */}
              <div className="px-1">
                <p className="text-zinc-300 text-sm truncate">{image.name}</p>
                <p className="text-zinc-600 text-xs">{image.type}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <AnimatePresence>
        {/* Use Image Button (normal mode) */}
        {!isManageMode && selectedImage && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300
            }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent"
          >
            <button
              onClick={handleUseImage}
              className="w-full py-4 bg-emerald-500/90 hover:bg-emerald-500 text-black rounded-2xl transition-all duration-200 shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] active:scale-[0.98]"
            >
              使用这张图片
            </button>
          </motion.div>
        )}

        {/* Delete Button (manage mode) */}
        {isManageMode && selectedForDelete.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300
            }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent"
          >
            <button
              onClick={handleDelete}
              className="w-full py-4 bg-red-500/90 hover:bg-red-500 text-white rounded-2xl transition-all duration-200 shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:shadow-[0_0_40px_rgba(239,68,68,0.3)] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              删除 {selectedForDelete.length} 张图片
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
