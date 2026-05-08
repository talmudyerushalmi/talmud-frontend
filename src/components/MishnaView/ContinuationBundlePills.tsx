import React, { useCallback, useEffect, useState } from 'react';
import { ContinuationBundle, getContinuationBundlesList, TaggingSubline } from '../../services/tagging.service';

interface Props {
  taggingData: TaggingSubline[];
  sublineRefs: Map<number, HTMLElement>;
  containerRef: React.RefObject<HTMLElement>;
}

interface PositionedExtension {
  bundle: ContinuationBundle;
  top: number;
  left: number;
  width: number;
  height: number;
}

const ContinuationBundlePills: React.FC<Props> = ({ taggingData, sublineRefs, containerRef }) => {
  const [extensions, setExtensions] = useState<PositionedExtension[]>([]);

  const computePositions = useCallback(() => {
    if (!containerRef.current || sublineRefs.size === 0) {
      setExtensions([]);
      return;
    }
    const containerRect = containerRef.current.getBoundingClientRect();
    const bundles = getContinuationBundlesList(taggingData);

    const result: PositionedExtension[] = [];
    for (const bundle of bundles) {
      if (bundle.members.length < 2) continue;
      const sourceEl = sublineRefs.get(bundle.sourceIndex);
      const lastEl = sublineRefs.get(bundle.members[bundle.members.length - 1]);
      if (!sourceEl || !lastEl) continue;

      const chipEl = sourceEl.querySelector<HTMLElement>('[data-bundle-source="true"]');
      if (!chipEl) continue;

      const chipRect = chipEl.getBoundingClientRect();
      const lastRect = lastEl.getBoundingClientRect();

      const top = chipRect.bottom - containerRect.top;
      const height = (lastRect.top + lastRect.height) - chipRect.bottom;
      if (height <= 0) continue;
      const left = chipRect.left - containerRect.left;
      const width = chipRect.width;

      result.push({ bundle, top, left, width, height });
    }
    setExtensions(result);
  }, [taggingData, sublineRefs, containerRef]);

  useEffect(() => {
    computePositions();
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => computePositions());
    observer.observe(container);
    return () => observer.disconnect();
  }, [computePositions, containerRef]);

  if (extensions.length === 0) return null;

  return (
    <>
      {extensions.map(({ bundle, top, left, width, height }, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top,
            left,
            width,
            height,
            backgroundColor: bundle.sourceColor + '22',
            borderLeft: `1px solid ${bundle.sourceColor}`,
            borderRight: `1px solid ${bundle.sourceColor}`,
            borderBottom: `1px solid ${bundle.sourceColor}`,
            borderBottomLeftRadius: 9,
            borderBottomRightRadius: 9,
            boxSizing: 'border-box',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
};

export default ContinuationBundlePills;
