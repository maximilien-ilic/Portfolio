import SvgT from '@/components/i18n/SvgT';
import Sketch from './Sketch';
import styles from './minis.module.css';

/* Secure Formula 1 CRUD: attacks typed into the form get stopped — an SQL
   injection, then a script tag — and a real name goes through and lands in
   the table. One 9 s loop, three beats of 3 s. */

const PHASES = [
  { text: "' OR 1=1 --", stamp: 'SQLi blocked', fr: 'SQLi bloquée', tone: styles.stampBad, cls: styles.phaseA },
  { text: '<script>alert(1)', stamp: 'XSS escaped', fr: 'XSS échappé', tone: styles.stampBad, cls: styles.phaseB },
  { text: 'Leclerc', stamp: 'inserted ✓', fr: 'ajouté ✓', tone: styles.stampGood, cls: styles.phaseC }
];

const ROWS = [
  ['Hamilton', 'Ferrari'],
  ['Piastri', 'McLaren'],
  ['Russell', 'Mercedes']
];

export default function SecureCrud() {
  return (
    <Sketch label="Attacks typed into a form get blocked, then a valid driver is added to the table">
      {/* The input */}
      <text x="22" y="18" className={styles.label}>
        <SvgT fr="ajouter un pilote" en="add a driver" />
      </text>
      <g className={styles.ink}>
        <rect x="22" y="24" width="186" height="24" rx="4" className={styles.field} />
      </g>

      {PHASES.map((phase) => (
        <g key={phase.text} className={phase.cls}>
          <text x="30" y="40" className={styles.typed}>
            {phase.text}
          </text>
          {/* Slides right in steps, one character at a time, to reveal the
              text as if typed. 4.8 units is one character at this size. */}
          <rect
            x="28"
            y="28"
            width={phase.text.length * 4.8 + 6}
            height="16"
            className={styles.typeCover}
            style={{ ['--w' as string]: `${phase.text.length * 4.8 + 6}px` }}
          />
          <g transform="translate(216 26)">
            <g className={`${styles.stamp} ${phase.tone}`}>
              <rect width="86" height="20" rx="3" />
              <text x="43" y="13.5" textAnchor="middle">
                <SvgT fr={phase.fr} en={phase.stamp} />
              </text>
            </g>
          </g>
        </g>
      ))}

      {/* The table */}
      <g transform="translate(22 66)">
        <text x="6" y="10" className={styles.tableHead}>
          <SvgT fr="pilote" en="driver" />
        </text>
        <text x="96" y="10" className={styles.tableHead}>
          <SvgT fr="écurie" en="team" />
        </text>
        <text x="236" y="10" textAnchor="end" className={styles.tableHead}>
          <SvgT fr="modifier · suppr." en="edit · delete" />
        </text>
        <g className={styles.ink}>
          {[16, 40, 64, 88, 112].map((y) => (
            <path key={y} d={`M0 ${y} H276`} className={styles.thin} />
          ))}
        </g>
        {ROWS.map(([driver, team], i) => (
          <g key={driver} transform={`translate(0 ${16 + i * 24})`}>
            <text x="6" y="16" className={styles.cell}>
              {driver}
            </text>
            <text x="96" y="16" className={styles.cell}>
              {team}
            </text>
            <text x="236" y="16" textAnchor="end" className={styles.cell}>
              ✎ ✕
            </text>
          </g>
        ))}
        <g transform="translate(0 88)" className={styles.newRow}>
          <rect width="276" height="24" className={styles.newRowFill} />
          <text x="6" y="16" className={styles.cell}>
            Leclerc
          </text>
          <text x="96" y="16" className={styles.cell}>
            Ferrari
          </text>
          <text x="236" y="16" textAnchor="end" className={styles.cell}>
            ✎ ✕
          </text>
        </g>
      </g>

      <text x="298" y="194" textAnchor="end" className={styles.label}>
        <SvgT fr="PDO préparé · jeton CSRF ✓" en="PDO prepared · CSRF token ✓" />
      </text>
    </Sketch>
  );
}
