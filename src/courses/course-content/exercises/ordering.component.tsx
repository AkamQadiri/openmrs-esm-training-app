import { Button } from '@carbon/react';
import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type Exercise, type OrderingContent } from '../../../types';
import { getLocalizedText } from '../../../utils/helpers';
import { ArrowDown, ArrowUp } from '@carbon/react/icons';
import styles from './ordering.scss';

interface OrderingProps {
  exercise: Exercise;
  onChoiceChanged: (response: { order: string[] } | null) => void;
  disabled?: boolean;
}

const Ordering: React.FC<OrderingProps> = ({ exercise, onChoiceChanged, disabled = false }) => {
  const { t, i18n } = useTranslation();

  const content = exercise.content as OrderingContent;
  const [orderedItems, setOrderedItems] = useState<string[]>([]);

  useEffect(() => {
    const initialOrder = content.items.map((item) => item.id);
    setOrderedItems(initialOrder);
  }, [content.items]);

  useEffect(() => {
    if (orderedItems.length > 0) {
      onChoiceChanged({ order: orderedItems });
    }
  }, [orderedItems, onChoiceChanged]);

  const moveUp = useCallback(
    (index: number) => {
      if (disabled || index <= 0) return;
      const newOrder = [...orderedItems];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      setOrderedItems(newOrder);
    },
    [orderedItems, disabled],
  );

  const moveDown = useCallback(
    (index: number) => {
      if (disabled || index >= orderedItems.length - 1) return;
      const newOrder = [...orderedItems];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setOrderedItems(newOrder);
    },
    [orderedItems, disabled],
  );

  return (
    <>
      <ol className={styles.itemsList}>
        {orderedItems.map((itemId, index) => {
          const item = content.items.find((i) => i.id === itemId);
          const itemText = item ? getLocalizedText(i18n.language, item.text) : '';

          return (
            <li key={itemId} className={styles.orderItem}>
              <span className={styles.itemText}>{itemText}</span>
              <div className={styles.controls}>
                <Button
                  kind="ghost"
                  size="sm"
                  renderIcon={ArrowUp}
                  iconDescription={t('moveUp')}
                  hasIconOnly
                  onClick={() => moveUp(index)}
                  disabled={disabled || index === 0}
                />
                <Button
                  kind="ghost"
                  size="sm"
                  renderIcon={ArrowDown}
                  iconDescription={t('moveDown')}
                  hasIconOnly
                  onClick={() => moveDown(index)}
                  disabled={disabled || index === orderedItems.length - 1}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
};

export default Ordering;
