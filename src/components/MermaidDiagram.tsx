import mermaid from 'mermaid';
import { FC, useEffect, useState } from 'react';
import { UncontrolledReactSVGPanZoom, TOOL_PAN } from 'react-svg-pan-zoom';
import { ReactSvgPanZoomLoader } from 'react-svg-pan-zoom-loader';

import { useSafeId } from '../hooks/useSafeId';

import { useTheme } from './ThemeProvider';
import { AutoResize } from './AutoResize';

export const MermaidDiagram: FC<{ diagram: string }> = ({ diagram }) => {
  const diagramId = useSafeId();

  const { actualTheme } = useTheme();

  const [mermaidSvg, setMermaidSvg] = useState('');

  useEffect(() => {
    mermaid.mermaidAPI.initialize({
      startOnLoad: true,
      securityLevel: 'loose',
      theme: actualTheme === 'dark' ? 'dark' : 'default',
      logLevel: 5,
    });
  }, [actualTheme]);

  useEffect(() => {
    (async () => {
      if (!diagram || !actualTheme) {
        return;
      }

      let valid: boolean;
      try {
        valid = (await mermaid.parse(diagram)) ?? false;
      } catch {
        valid = false;
      }

      if (!valid) {
        setMermaidSvg(diagram);
        return;
      }

      const { svg } = await mermaid.mermaidAPI.render(
        CSS.escape(diagramId),
        diagram,
      );

      setMermaidSvg(svg);
    })();
  }, [diagramId, diagram, actualTheme]);

  const isSvg = mermaidSvg.startsWith('<svg');

  return isSvg ? (
    <AutoResize>
      {({ width, height }) => (
        <ReactSvgPanZoomLoader
          svgXML={mermaidSvg}
          render={(content) => (
            <UncontrolledReactSVGPanZoom
              width={width}
              height={height}
              defaultTool={TOOL_PAN}
              background="transparent"
              toolbarProps={{
                position: 'none',
              }}
            >
              <svg width={100} height={100}>
                {content}
              </svg>
            </UncontrolledReactSVGPanZoom>
          )}
        />
      )}
    </AutoResize>
  ) : (
    <>{mermaidSvg}</>
  );
};
