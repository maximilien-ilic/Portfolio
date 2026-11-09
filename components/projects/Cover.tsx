import type { ComponentType } from 'react';
import type { Work } from '@/data/work';
import Automations from './minis/Automations';
import BlenderNav from './minis/BlenderNav';
import Boxing from './minis/Boxing';
import ChildTheme from './minis/ChildTheme';
import DeckRoyale from './minis/DeckRoyale';
import DiveLog from './minis/DiveLog';
import MineralMap from './minis/MineralMap';
import SecureCrud from './minis/SecureCrud';
import styles from './Cover.module.css';

/* Each project's cover is a small hand-drawn animation of what it does. */
const MINIS: Record<string, ComponentType> = {
  'reverse-engineering-scuba-diving': DiveLog,
  N8N: Automations,
  'Crud-security-formula1': SecureCrud,
  'Neuron-Boxing': Boxing,
  'Mineral-Map': MineralMap,
  'Deck-Royale': DeckRoyale,
  'Add-on-Accessibility-Blender': BlenderNav,
  'theme-enfant-Miyazaki-PSG': ChildTheme
};

export default function Cover({ work }: { work: Work }) {
  const Mini = MINIS[work.repo];

  return <div className={styles.cover}>{Mini && <Mini />}</div>;
}
