import mermaid from 'mermaid';
import { FC, useEffect, useState } from 'react';

import { useSafeId } from '../hooks/useSafeId';

import { useTheme } from './ThemeProvider';

export const MermaidDiagram: FC<{ diagram: string }> = ({ diagram }) => {
  const containerId = useSafeId();

  const { actualTheme } = useTheme();

  const [mermaidSvg, setMermaidSvg] = useState('');

  useEffect(() => {
    mermaid.mermaidAPI.initialize({
      startOnLoad: true,
      securityLevel: 'loose',
      theme: actualTheme === 'dark' ? 'dark' : 'forest',
      logLevel: 5,
    });
  }, [actualTheme]);

  useEffect(() => {
    (async () => {
      if (!diagram) {
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
        CSS.escape(containerId),
        diagram,
      );

      setMermaidSvg(svg);
    })();
  }, [containerId, diagram, actualTheme]);

  return <div dangerouslySetInnerHTML={{ __html: mermaidSvg }} />;
};
