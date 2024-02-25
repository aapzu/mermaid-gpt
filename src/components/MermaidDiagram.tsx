import mermaid from 'mermaid';
import { FC, useEffect, useState } from 'react';

import { useSafeId } from '../hooks/useSafeId';

export const MermaidDiagram: FC<{ diagram: string }> = ({ diagram }) => {
  const containerId = useSafeId();

  const [mermaidSvg, setMermaidSvg] = useState('');

  useEffect(() => {
    mermaid.mermaidAPI.initialize({
      startOnLoad: true,
      securityLevel: 'loose',
      theme: 'forest',
      logLevel: 5,
    });
  }, []);

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
      }

      const { svg } = await mermaid.mermaidAPI.render(
        CSS.escape(containerId),
        diagram,
      );

      setMermaidSvg(svg);
    })();
  }, [containerId, diagram]);

  return <div dangerouslySetInnerHTML={{ __html: mermaidSvg }} />;
};