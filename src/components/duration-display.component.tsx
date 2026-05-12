import React from 'react';
import { Time } from '@carbon/react/icons';
import { formatDuration } from '../utils/helpers';
import { useTranslation } from 'react-i18next';
import styles from './duration-display.scss';

interface DurationDisplayProps {
  minutes: number;
  iconSize?: 16 | 20;
  showLabel?: boolean;
  label?: string;
}

const DurationDisplay: React.FC<DurationDisplayProps> = ({ minutes, iconSize = 16, showLabel = false, label }) => {
  const { t } = useTranslation();

  if (showLabel) {
    if (!label) {
      label = t('estimatedTime');
    }

    return (
      <aside className={styles.labelDisplay}>
        <span>
          {label}: {minutes} min
        </span>
      </aside>
    );
  }

  return (
    <aside className={styles.iconDisplay}>
      <Time size={iconSize} />
      <time>{formatDuration(minutes)}</time>
    </aside>
  );
};

export default DurationDisplay;
