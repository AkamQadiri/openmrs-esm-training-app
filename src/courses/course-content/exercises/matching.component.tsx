import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type Exercise, type MatchingContent } from '../../../types';
import { getLocalizedText } from '../../../utils/helpers';
import styles from './matching.scss';

interface MatchingProps {
  exercise: Exercise;
  onChoiceChanged: (response: Record<string, string> | null) => void;
  disabled?: boolean;
}

interface Position {
  x: number;
  y: number;
}

const Matching: React.FC<MatchingProps> = ({ exercise, onChoiceChanged, disabled = false }) => {
  const { i18n } = useTranslation();
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [itemPositions, setItemPositions] = useState<Record<string, Position>>({});

  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  const content = exercise.content as MatchingContent;

  const updatePositions = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newPositions: Record<string, Position> = {};

    content.leftItems.forEach((item) => {
      const element = leftRefs.current[item.id];
      if (element) {
        const rect = element.getBoundingClientRect();
        newPositions[`left-${item.id}`] = {
          x: rect.right - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        };
      }
    });

    content.rightItems.forEach((item) => {
      const element = rightRefs.current[item.id];
      if (element) {
        const rect = element.getBoundingClientRect();
        newPositions[`right-${item.id}`] = {
          x: rect.left - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        };
      }
    });

    setItemPositions(newPositions);
  }, [content.leftItems, content.rightItems]);

  useEffect(() => {
    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, [updatePositions]);

  const handleLeftClick = useCallback(
    (itemId: string) => {
      if (disabled) return;

      if (matches[itemId]) {
        const updatedMatches = { ...matches };
        delete updatedMatches[itemId];
        setMatches(updatedMatches);
        const allMatched = Object.keys(updatedMatches).length === content.leftItems.length;
        onChoiceChanged(allMatched ? updatedMatches : null);
        setSelectedLeft(null);
        return;
      }

      setSelectedLeft(selectedLeft === itemId ? null : itemId);
    },
    [matches, selectedLeft, onChoiceChanged, content.leftItems.length, disabled],
  );

  const handleRightClick = useCallback(
    (itemId: string) => {
      if (disabled || !selectedLeft) return;

      const updatedMatches = { ...matches, [selectedLeft]: itemId };
      setMatches(updatedMatches);
      const allMatched = Object.keys(updatedMatches).length === content.leftItems.length;
      onChoiceChanged(allMatched ? updatedMatches : null);
      setSelectedLeft(null);
    },
    [selectedLeft, matches, onChoiceChanged, content.leftItems.length, disabled],
  );

  const isLeftMatched = (itemId: string) => !!matches[itemId];
  const isRightMatched = (itemId: string) => Object.values(matches).includes(itemId);

  return (
    <div ref={containerRef} className={styles.matchingContainer}>
      <ul className={styles.leftColumn}>
        {content.leftItems.map((item) => {
          const text = getLocalizedText(i18n.language, item.text);
          const matched = isLeftMatched(item.id);
          const selected = selectedLeft === item.id;

          return (
            <li key={item.id}>
              <button
                ref={(el) => (leftRefs.current[item.id] = el)}
                onClick={() => handleLeftClick(item.id)}
                type="button"
                disabled={disabled}
                className={`${styles.matchButton} ${matched ? styles.matched : ''} ${selected ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
              >
                {text}
              </button>
            </li>
          );
        })}
      </ul>

      <svg className={styles.connectionsSvg}>
        {Object.entries(matches).map(([leftId, rightId]) => {
          const start = itemPositions[`left-${leftId}`];
          const end = itemPositions[`right-${rightId}`];

          if (!start || !end) return null;

          return (
            <line
              key={`${leftId}-${rightId}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              className={styles.connectionLine}
            />
          );
        })}
      </svg>

      <ul className={styles.rightColumn}>
        {content.rightItems.map((item) => {
          const text = getLocalizedText(i18n.language, item.text);
          const matched = isRightMatched(item.id);
          const buttonDisabled = disabled || !selectedLeft || matched;

          return (
            <li key={item.id}>
              <button
                ref={(el) => (rightRefs.current[item.id] = el)}
                onClick={() => handleRightClick(item.id)}
                disabled={buttonDisabled}
                type="button"
                className={`${styles.matchButton} ${matched ? styles.matched : ''} ${buttonDisabled ? styles.disabled : ''}`}
              >
                {text}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Matching;
