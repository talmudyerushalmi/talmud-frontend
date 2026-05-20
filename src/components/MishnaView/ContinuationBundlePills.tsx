import React, { useCallback, useEffect, useState } from 'react';
import { alpha } from '@mui/material/styles';
import { ContinuationBundle, getContinuationBundlesList, TaggingSubline } from '../../services/tagging.service';

/**
 * DOM contract: SublineDisplay must render an element with this attribute on
 * the chip that represents the SOURCE of a continuation bundle. This component
 * uses it to locate the chip and draw the bracket extending down to the
 * bundle's last member subline. If the attribute is removed in SublineDisplay,
 * the bracket silently disappears with no runtime error.
 */
export const BUNDLE_SOURCE_ATTR = 'data-bundle-source';
const BUNDLE_SOURCE_SELECTOR = `[${BUNDLE_SOURCE_ATTR}="true"]`;

interface Props {
  taggingData: TaggingSubline[];
  sublineRefs: Map<number, HTMLElement>;
  containerRef: React.RefObject<HTMLElement | null>;
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

      const chipEl = sourceEl.querySelector<HTMLElement>(BUNDLE_SOURCE_SELECTOR);
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
            backgroundColor: alpha(bundle.sourceColor, 0.13),
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
