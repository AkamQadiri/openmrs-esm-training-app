import React, { type ReactNode } from 'react';
import { Tile } from '@carbon/react';
import styles from './statistic-tile.scss';

interface StatisticTileProps {
  label: string;
  value: string | number | ReactNode;
  formatValue?: (value: any) => string;
}

const StatisticTile: React.FC<StatisticTileProps> = ({ label, value, formatValue }) => {
  const displayValue = formatValue && typeof value !== 'object' ? formatValue(value) : value;

  return (
    <article className={styles.statisticTile}>
      <Tile className={styles.tile}>
        <header className={styles.tileHeader}>
          <h3>{label}</h3>
        </header>
        <div className={styles.tileValue}>{displayValue}</div>
      </Tile>
    </article>
  );
};

export default StatisticTile;
