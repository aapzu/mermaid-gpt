import { useEffect, useMemo, useRef, useState } from 'react';

type TAutoResizeChildFunction = (attrs: {
  height: number;
  width: number;
}) => React.ReactNode;

type TAutoResizeProps = {
  children: TAutoResizeChildFunction;
};

export const AutoResize = ({ children }: TAutoResizeProps) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setWidth(width);
        setHeight(height);
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const renderedChildren = useMemo(
    () => children({ width, height }),
    [children, height, width],
  );

  return (
    <div ref={ref} className="w-full h-full">
      {renderedChildren}
    </div>
  );
};
