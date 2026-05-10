import React, { useCallback, useEffect, useState } from 'react';
import { TAGGING_CATEGORIES, TaggingSubline } from '../../services/tagging.service';

interface ConnectionGroup {
  sourceIndex: number;
  targetIndices: number[];
  categoryId: string;
  color: string;
}

interface ArrowGroup {
  sourceY: number;
  targetYs: number[];
  color: string;
  lane: number;
}

interface Props {
  taggingData: TaggingSubline[];
  sublineRefs: Map<number, HTMLElement>;
  containerRef: React.RefObject<HTMLElement>;
}

const LANE_WIDTH = 10;
const MARGIN_RIGHT = 4;
const MAX_LANES = 6;

const CategoryConnectionLines: React.FC<Props> = ({ taggingData, sublineRefs, containerRef }) => {
  const [arrows, setArrows] = useState<ArrowGroup[]>([]);
  const [svgHeight, setSvgHeight] = useState(0);

  const computePositions = useCallback(() => {
    if (!containerRef.current || sublineRefs.size === 0) {
      setArrows([]);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();

    const groups: ConnectionGroup[] = [];
    for (const sub of taggingData) {
      for (const cat of sub.categories) {
        const catDef = TAGGING_CATEGORIES.find(c => c.id === cat.categoryId);
        if (!catDef) continue;
        const targets = cat.connections
          .filter(c => c.type === 'subline' && c.sublineIndex != null)
          .map(c => c.sublineIndex!);
        if (targets.length === 0) continue;

        const existing = groups.find(g => g.sourceIndex === sub.index && g.categoryId === cat.categoryId);
        if (existing) {
          for (const t of targets) {
            if (!existing.targetIndices.includes(t)) existing.targetIndices.push(t);
          }
        } else {
          groups.push({ sourceIndex: sub.index, targetIndices: [...targets], categoryId: cat.categoryId, color: catDef.color });
        }
      }
    }

    if (groups.length === 0) {
      setArrows([]);
      return;
    }

    const sorted = [...groups].sort((a, b) => {
      const allA = [a.sourceIndex, ...a.targetIndices];
      const allB = [b.sourceIndex, ...b.targetIndices];
      const spanA = Math.max(...allA) - Math.min(...allA);
      const spanB = Math.max(...allB) - Math.min(...allB);
      return spanA - spanB;
    });

    const measured = sorted.map((group) => {
      const sourceEl = sublineRefs.get(group.sourceIndex);
      if (!sourceEl) return null;
      const sourceRect = sourceEl.getBoundingClientRect();
      const sourceY = sourceRect.top - containerRect.top + sourceRect.height / 2;

      const targetYs: number[] = [];
      for (const tIdx of group.targetIndices) {
        const tEl = sublineRefs.get(tIdx);
        if (!tEl) continue;
        const tRect = tEl.getBoundingClientRect();
        targetYs.push(tRect.top - containerRect.top + tRect.height / 2);
      }
      if (targetYs.length === 0) return null;

      const allYs = [sourceY, ...targetYs];
      return { sourceY, targetYs, color: group.color, minY: Math.min(...allYs), maxY: Math.max(...allYs) };
    }).filter(Boolean) as Array<Omit<ArrowGroup, 'lane'> & { minY: number; maxY: number }>;

    const laneIntervals: Array<Array<[number, number]>> = [];
    const positioned: ArrowGroup[] = measured.map((m) => {
      let assignedLane = -1;
      for (let lane = 0; lane < MAX_LANES; lane++) {
        const intervals = laneIntervals[lane];
        if (!intervals || !intervals.some(([eMin, eMax]) => !(m.maxY < eMin || m.minY > eMax))) {
          assignedLane = lane;
          break;
        }
      }
      if (assignedLane === -1) {
        let bestLane = 0;
        let bestCount = laneIntervals[0]?.length ?? 0;
        for (let lane = 1; lane < MAX_LANES; lane++) {
          const count = laneIntervals[lane]?.length ?? 0;
          if (count < bestCount) { bestCount = count; bestLane = lane; }
        }
        assignedLane = bestLane;
      }
      if (!laneIntervals[assignedLane]) laneIntervals[assignedLane] = [];
      laneIntervals[assignedLane].push([m.minY, m.maxY]);
      return { sourceY: m.sourceY, targetYs: m.targetYs, color: m.color, lane: assignedLane };
    });

    setSvgHeight(containerRect.height);
    setArrows(positioned);
  }, [taggingData, sublineRefs, containerRef]);

  useEffect(() => {
    computePositions();
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => computePositions());
    observer.observe(container);
    return () => observer.disconnect();
  }, [computePositions, containerRef]);

  if (arrows.length === 0) return null;

  const lanesUsed = Math.min(MAX_LANES, Math.max(...arrows.map(a => a.lane)) + 1);
  const totalWidth = (lanesUsed * LANE_WIDTH) + MARGIN_RIGHT + 4;

  return (
    <svg
      style={{
        position: 'absolute',
        right: `-${totalWidth}px`,
        top: 0,
        width: `${totalWidth}px`,
        height: `${svgHeight}px`,
        pointerEvents: 'none',
        overflow: 'visible',
      }}>
      <defs>
        {arrows.map((arrow, i) => (
          <marker
            key={i}
            id={`arrowhead-${i}`}
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill={arrow.color} fillOpacity={0.8} />
          </marker>
        ))}
      </defs>
      {arrows.map((arrow, i) => {
        const x = MARGIN_RIGHT + (arrow.lane * LANE_WIDTH) + LANE_WIDTH / 2;
        const allYs = [arrow.sourceY, ...arrow.targetYs];
        const minY = Math.min(...allYs);
        const maxY = Math.max(...allYs);
        const tickLen = 6;

        return (
          <g key={i}>
            <line
              x1={x} y1={minY}
              x2={x} y2={maxY}
              stroke={arrow.color} strokeWidth={2} strokeOpacity={0.7}
            />
            {/* Source: dot */}
            <line
              x1={x} y1={arrow.sourceY}
              x2={x - tickLen} y2={arrow.sourceY}
              stroke={arrow.color} strokeWidth={2} strokeOpacity={0.7}
            />
            <circle cx={x - tickLen} cy={arrow.sourceY} r={2.5} fill={arrow.color} fillOpacity={0.8} />
            {/* Targets: arrows pointing toward the text */}
            {arrow.targetYs.map((ty, j) => (
              <line
                key={j}
                x1={x} y1={ty}
                x2={x - tickLen - 4} y2={ty}
                stroke={arrow.color} strokeWidth={2} strokeOpacity={0.7}
                markerEnd={`url(#arrowhead-${i})`}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

export default CategoryConnectionLines;
