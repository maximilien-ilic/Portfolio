"use client";

import * as React from "react";
import { motion, useSpring, useMotionValue } from "motion/react";
import T from "@/components/i18n/T";
import styles from "./GitHubActivityGrid.module.css";

/* Adapted from Wensity's GitHub-Style Activity Grid
   (https://ui.wensity.com/components/github-activity-grid): one tooltip
   shared by every day, sprung between cells, and a reveal that runs
   backwards from today. Cells snap to whole-pixel sizes so they stay crisp
   at any width; below a readable size (phones) the grid keeps that size and
   scrolls sideways instead, opened on the most recent weeks.

   The cells are plain buttons: the reveal is CSS (it starts when the grid
   scrolls into view, see the module) and one delegated handler serves all
   371 of them. */

export interface ActivityDay {
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  /** 0..n raw count (will be bucketed into 5 levels). */
  count: number;
}

export interface GitHubActivityGridProps {
  /**
   * Days, oldest-first. Length should be exactly the visible window
   * (typically 365 or 371 for a clean 53-week grid).
   */
  days: ActivityDay[];
  /**
   * Maximum count used to compute level buckets. Defaults to the max in
   * `days` (so colors are always relative to the dataset).
   */
  maxCount?: number;
  /** Cell size in px. Default 12. */
  cellSize?: number;
  /** Gap between cells in px. Default 4. */
  cellGap?: number;
  /** Text shown after the total. Default "contributions in the last year"
      (in both languages); null hides the total line. */
  label?: React.ReactNode;
  /** Singular / plural unit used in the tooltip, in each language. */
  unit?: { fr: [singular: string, plural: string]; en: [singular: string, plural: string] };
  className?: string;
}

const LEVEL_CLASS = [styles.l0, styles.l1, styles.l2, styles.l3, styles.l4] as const;

const WEEKDAYS = [
  null,
  { fr: "Lun", en: "Mon" },
  null,
  { fr: "Mer", en: "Wed" },
  null,
  { fr: "Ven", en: "Fri" },
  null,
] as const;
const MONTHS = {
  fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

const DEFAULT_UNIT = {
  fr: ["contribution", "contributions"] as [string, string],
  en: ["contribution", "contributions"] as [string, string],
};

const WEEKDAY_LABEL_WIDTH = 28;
const WEEKDAY_LABEL_GAP = 4;

/* Smallest cell that is still readable and tappable. */
const MIN_CELL = 10;
const MIN_GAP = 3;

/** The largest whole-pixel cell (and matching gap) that fits the width.
    Fractional cells would blur, so the grid steps down a pixel at a time
    instead of scaling — down to MIN_CELL, after which it scrolls. */
function fitCells(weeks: number, available: number, cellSize: number, cellGap: number) {
  for (let cell = cellSize; cell > MIN_CELL; cell -= 1) {
    const gap = cell >= 12 ? cellGap : MIN_GAP;
    if (weeks * cell + (weeks - 1) * gap <= available) return { cell, gap, scrolls: false };
  }
  const fits = weeks * MIN_CELL + (weeks - 1) * MIN_GAP <= available;
  return { cell: MIN_CELL, gap: MIN_GAP, scrolls: !fits };
}

export function GitHubActivityGrid({
  days,
  maxCount,
  cellSize = 12,
  cellGap = 4,
  label = <T fr="contributions sur la dernière année" en="contributions in the last year" />,
  unit = DEFAULT_UNIT,
  className,
}: GitHubActivityGridProps) {

  /* ---------------- bucketise into 0..4 levels --------------------------- */
  const max = React.useMemo(() => {
    if (typeof maxCount === "number" && maxCount > 0) return maxCount;
    return Math.max(1, ...days.map((d) => d.count));
  }, [days, maxCount]);

  function level(count: number) {
    if (count <= 0) return 0;
    const ratio = count / max;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
  }

  /* ---------------- group into [week][weekday] grid ---------------------- */
  // Day 0 = first cell. We pad the start to align Sunday=0 of week 0.
  const grid = React.useMemo(() => {
    if (days.length === 0) return { weeks: [] as (ActivityDay | null)[][], monthLabels: [] as { col: number; month: number }[] };
    const first = new Date(days[0].date + "T00:00:00");
    const startWeekday = first.getDay(); // 0..6
    const flat: (ActivityDay | null)[] = [
      ...Array.from({ length: startWeekday }, () => null),
      ...days,
    ];
    // pad tail so each week is full
    while (flat.length % 7 !== 0) flat.push(null);

    const weeks: (ActivityDay | null)[][] = [];
    for (let i = 0; i < flat.length; i += 7) {
      weeks.push(flat.slice(i, i + 7));
    }

    // month labels per week column (label appears at first week containing day 1..7 of month)
    const monthLabels: { col: number; month: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((wk, col) => {
      const firstReal = wk.find(Boolean) as ActivityDay | undefined;
      if (!firstReal) return;
      const m = new Date(firstReal.date + "T00:00:00").getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ col, month: m });
        lastMonth = m;
      }
    });
    return { weeks, monthLabels };
  }, [days]);

  /* ---------------- single global tooltip — springed position ----------- */
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const tooltipX = useMotionValue(0);
  const tooltipY = useMotionValue(0);
  const springX = useSpring(tooltipX, { stiffness: 480, damping: 40, mass: 0.5 });
  const springY = useSpring(tooltipY, { stiffness: 480, damping: 40, mass: 0.5 });
  const [hover, setHover] = React.useState<ActivityDay | null>(null);
  const gridViewportRef = React.useRef<HTMLDivElement | null>(null);
  const [gridViewportWidth, setGridViewportWidth] = React.useState(0);

  React.useEffect(() => {
    const node = gridViewportRef.current;
    if (!node) return;

    const measure = () => setGridViewportWidth(node.clientWidth);
    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function pointAt(target: HTMLElement, day: ActivityDay) {
    const cont = containerRef.current;
    if (!cont) return;
    const r = target.getBoundingClientRect();
    const cr = cont.getBoundingClientRect();
    // Center-top of the cell, relative to container, kept far enough from
    // the edges that the tooltip never spills out on a narrow screen.
    const x = r.left - cr.left + r.width / 2;
    tooltipX.set(Math.min(Math.max(x, 90), cr.width - 90));
    tooltipY.set(r.top - cr.top - 8);
    setHover(day);
  }
  function onLeave() {
    setHover(null);
  }

  const totalContributions = React.useMemo(
    () => days.reduce((s, d) => s + d.count, 0),
    [days]
  );
  const weekCount = grid.weeks.length;
  const available = Math.max(0, gridViewportWidth - WEEKDAY_LABEL_WIDTH - WEEKDAY_LABEL_GAP);
  const { cell, gap, scrolls } =
    gridViewportWidth > 0
      ? fitCells(weekCount, available, cellSize, cellGap)
      : { cell: cellSize, gap: cellGap, scrolls: false };
  const gridWidth = weekCount * cell + Math.max(0, weekCount - 1) * gap;
  // Empty cells before the first day; used to turn a grid position back
  // into an index in `days`.
  const startPad = grid.weeks[0]?.findIndex(Boolean) ?? 0;

  // When the grid scrolls, open it on today.
  React.useLayoutEffect(() => {
    const node = gridViewportRef.current;
    if (node && scrolls) node.scrollLeft = node.scrollWidth;
  }, [scrolls, cell]);

  // One handler for every cell: the cell carries its day's index.
  function onCellEvent(e: React.SyntheticEvent<HTMLDivElement>) {
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-i]");
    if (target) pointAt(target, days[Number(target.dataset.i)]);
  }

  return (
    <div
      className={`${styles.card} ${className ?? ""}`}
      ref={containerRef}
      onPointerLeave={onLeave}
    >
      {/* Header */}
      <div className={styles.header}>
        {label !== null ? (
          <p className={styles.total}>
            <span className={styles.count}>{totalContributions.toLocaleString("en")}</span> {label}
          </p>
        ) : (
          <span />
        )}
        <Legend />
      </div>

      {/* Grid */}
      <div
        ref={gridViewportRef}
        data-lenis-prevent-horizontal=""
        className={`${styles.viewport} ${scrolls ? styles.scrolls : ""}`}
        onScroll={onLeave}
      >
        <div
          className={styles.months}
          style={{ width: gridWidth, marginLeft: WEEKDAY_LABEL_WIDTH + WEEKDAY_LABEL_GAP }}
        >
          {grid.monthLabels.map((m) => (
            <span
              key={`${m.col}-${m.month}`}
              className={styles.month}
              style={{ left: m.col * (cell + gap) }}
            >
              <T fr={MONTHS.fr[m.month]} en={MONTHS.en[m.month]} />
            </span>
          ))}
        </div>

        <div className={styles.body}>
          {/* Weekday labels */}
          <div
            className={styles.weekdays}
            style={{ gap, width: WEEKDAY_LABEL_WIDTH, marginRight: WEEKDAY_LABEL_GAP }}
          >
            {WEEKDAYS.map((wd, i) => (
              <span key={i} className={styles.weekday} style={{ height: cell }}>
                {wd && <T {...wd} />}
              </span>
            ))}
          </div>

          {/* Cells */}
          <div
            className={styles.weeks}
            style={{ gap }}
            onPointerOver={onCellEvent}
            onFocus={onCellEvent}
            onBlur={onLeave}
          >
            {grid.weeks.map((week, wIdx) => (
              <div key={wIdx} className={styles.week} style={{ gap }}>
                {week.map((day, dIdx) => {
                  if (!day) {
                    return (
                      <span
                        key={`pad-${wIdx}-${dIdx}`}
                        style={{ width: cell, height: cell }}
                      />
                    );
                  }
                  const lvl = level(day.count);
                  const fromEnd = days.length - 1 - (wIdx * 7 + dIdx - startPad);
                  return (
                    <button
                      key={day.date}
                      type="button"
                      data-i={wIdx * 7 + dIdx - startPad}
                      aria-label={`${day.count} · ${day.date}`}
                      className={`${styles.cell} ${LEVEL_CLASS[lvl]}`}
                      // index back from the end → most recent day first
                      style={{ width: cell, height: cell, ["--r" as string]: fromEnd }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ONE global tooltip — springs to the hovered cell */}
      <motion.div
        aria-hidden={!hover}
        style={{
          x: springX,
          y: springY,
          opacity: hover ? 1 : 0,
          translateX: "-50%",
          translateY: "-100%",
        }}
        className={styles.tooltip}
      >
        {hover ? (
          <>
            <strong>{hover.count}</strong>{" "}
            <T fr={unit.fr[hover.count === 1 ? 0 : 1]} en={unit.en[hover.count === 1 ? 0 : 1]} />
            <span className={styles.date}>
              · <T fr={formatDate(hover.date, "fr-FR")} en={formatDate(hover.date, "en-GB")} />
            </span>
          </>
        ) : null}
      </motion.div>
    </div>
  );
}

function Legend() {
  return (
    <div className={styles.legend} aria-hidden="true">
      <span>
        <T fr="Moins" en="Less" />
      </span>
      {LEVEL_CLASS.map((cls, i) => (
        <span key={i} className={`${styles.swatch} ${cls}`} />
      ))}
      <span>
        <T fr="Plus" en="More" />
      </span>
    </div>
  );
}

function formatDate(iso: string, locale: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
