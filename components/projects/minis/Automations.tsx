import SvgT from '@/components/i18n/SvgT';
import Sketch from './Sketch';
import styles from './minis.module.css';

/* Local AI automations: the two n8n workflows as node chains, with a
   message travelling through each one. Top: the 6 pm email recap. Bottom:
   the pull-request audit, whose last node is the security report. */

const ROWS = [
  { title: 'daily email recap', fr: 'résumé quotidien des emails', y: 46, nodes: ['18:00', 'Gmail', 'Agent', 'Discord'], x0: 22, step: 72, packet: '' },
  { title: 'pull request audit', fr: 'audit de pull request', y: 128, nodes: ['PR', 'Claude', 'Report'], x0: 58, step: 84, packet: styles.packetBottom }
];

const W = 56;
const H = 28;

export default function Automations() {
  return (
    <Sketch label="Two automation workflows passing messages from node to node">
      {ROWS.map((row, r) => (
        <g key={row.title} style={{ ['--row' as string]: r }}>
          <text x={row.x0} y={row.y - 10} className={styles.label}>
            <SvgT fr={row.fr} en={row.title} />
          </text>

          <g className={styles.ink}>
            {row.nodes.slice(1).map((_, i) => {
              const from = row.x0 + i * row.step + W;
              const to = row.x0 + (i + 1) * row.step;
              return <path key={i} d={`M${from} ${row.y + H / 2} H${to}`} className={styles.thin} />;
            })}
          </g>

          {/* The message: a dot that hops from node to node. Drawn before the
              nodes so it slips behind them: it shows on the wires, and the
              node lights up when it arrives. */}
          <circle
            r="3.5"
            cx={row.x0 + W / 2}
            cy={row.y + H / 2}
            className={`${styles.packet} ${row.packet}`}
            style={{ ['--step' as string]: `${row.step}px` }}
          />
          {row.nodes.map((node, i) => {
            const last = r === 1 && i === row.nodes.length - 1;
            return (
              <g
                key={node}
                transform={`translate(${row.x0 + i * row.step} ${row.y})`}
                className={`${styles.node} ${last ? styles.alert : ''}`}
                style={{ ['--n' as string]: i }}
              >
                <rect width={W} height={H} rx="7" className={styles.nodeBox} />
                <text x={W / 2} y={H / 2 + 3} textAnchor="middle" className={styles.nodeLabel}>
                  {node === 'Report' ? <SvgT fr="Rapport" en="Report" /> : node}
                </text>
              </g>
            );
          })}
        </g>
      ))}
    </Sketch>
  );
}
