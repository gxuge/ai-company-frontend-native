import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

const DESIGN_WIDTH = 405;
const MIN_DESIGN_HEIGHT = 720;

export function FixedDesignCanvas({
  children,
  className = '',
  canvasClassName = '',
}: {
  children: ReactNode;
  className?: string;
  canvasClassName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(DESIGN_WIDTH);
  const [canvasHeight, setCanvasHeight] = useState(MIN_DESIGN_HEIGHT);
  const scale = containerWidth / DESIGN_WIDTH;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) {
      return;
    }

    const updateMeasurements = () => {
      setContainerWidth(Math.max(1, container.getBoundingClientRect().width));
      setCanvasHeight(Math.max(MIN_DESIGN_HEIGHT, canvas.scrollHeight));
    };
    const observer = new ResizeObserver(updateMeasurements);

    observer.observe(container);
    observer.observe(canvas);
    updateMeasurements();
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen w-full overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}>
      <div ref={containerRef} className="mx-auto w-full max-w-[520px]">
        <div className="relative w-full" style={{ height: Math.ceil(canvasHeight * scale) }}>
          <div
            ref={canvasRef}
            className={`absolute top-0 left-0 min-h-[720px] w-[405px] overflow-x-hidden ${canvasClassName}`}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
