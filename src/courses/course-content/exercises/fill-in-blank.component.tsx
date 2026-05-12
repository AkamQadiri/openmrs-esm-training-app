import { Tag } from '@carbon/react';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type Exercise, type FillInBlankContent } from '../../../types';
import { getLocalizedText } from '../../../utils/helpers';
import styles from './fill-in-blank.scss';

interface FillInBlankProps {
  exercise: Exercise;
  onChoiceChanged: (response: Record<string, string> | null) => void;
  disabled?: boolean;
}

const FillInBlank: React.FC<FillInBlankProps> = ({ exercise, onChoiceChanged, disabled = false }) => {
  const { i18n } = useTranslation();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [usedOptions, setUsedOptions] = useState<Set<number>>(new Set());
  const [draggedOptionIndex, setDraggedOptionIndex] = useState<number | null>(null);

  const content = exercise.content as FillInBlankContent;

  const blankIds = useMemo(() => {
    const text = getLocalizedText(i18n.language, content.text);
    const matches = text.match(/\{([1-9][0-9]*)\}/g);
    return matches ? matches.map((m) => m.match(/\{([1-9][0-9]*)\}/)?.[1] || '') : [];
  }, [content.text, i18n.language]);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
    },
    [disabled],
  );

  const handleDrop = useCallback(
    (blankId: string, e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      if (draggedOptionIndex === null || !content.options) return;

      const optionText = getLocalizedText(i18n.language, content.options[draggedOptionIndex]);
      const previousAnswer = answers[blankId];

      const updatedAnswers = { ...answers, [blankId]: optionText };
      setAnswers(updatedAnswers);

      const newUsedOptions = new Set(usedOptions);
      if (previousAnswer) {
        const previousIndex = content.options.findIndex(
          (opt) => getLocalizedText(i18n.language, opt) === previousAnswer,
        );
        if (previousIndex !== -1) newUsedOptions.delete(previousIndex);
      }
      newUsedOptions.add(draggedOptionIndex);
      setUsedOptions(newUsedOptions);

      const allFilled = blankIds.every((id) => updatedAnswers[id]);
      onChoiceChanged(allFilled ? updatedAnswers : null);
      setDraggedOptionIndex(null);
    },
    [draggedOptionIndex, answers, usedOptions, content.options, i18n.language, blankIds, onChoiceChanged, disabled],
  );

  const handleRemoveAnswer = useCallback(
    (blankId: string) => {
      if (disabled) return;
      const answerText = answers[blankId];
      if (!answerText || !content.options) return;

      const optionIndex = content.options.findIndex((opt) => getLocalizedText(i18n.language, opt) === answerText);

      const updatedAnswers = { ...answers };
      delete updatedAnswers[blankId];
      setAnswers(updatedAnswers);

      const newUsedOptions = new Set(usedOptions);
      if (optionIndex !== -1) newUsedOptions.delete(optionIndex);
      setUsedOptions(newUsedOptions);

      onChoiceChanged(null);
    },
    [answers, usedOptions, content.options, i18n.language, onChoiceChanged, disabled],
  );

  const text = getLocalizedText(i18n.language, content.text);
  const parts = text.split(/(\{[1-9][0-9]*\})/g);

  const availableOptions = content.options
    .map((option, index) => ({ option, index }))
    .filter(({ index }) => !usedOptions.has(index));

  return (
    <>
      <div className={styles.optionsBank}>
        {availableOptions.map(({ option, index }) => (
          <Tag
            key={index}
            type="blue"
            draggable={!disabled}
            onDragStart={() => !disabled && setDraggedOptionIndex(index)}
            onDragEnd={() => !disabled && setDraggedOptionIndex(null)}
            className={`${styles.draggableOption} ${disabled ? styles.disabled : ''}`}
          >
            {getLocalizedText(i18n.language, option)}
          </Tag>
        ))}
      </div>

      <p>
        {parts.map((part, index) => {
          const blankMatch = part.match(/\{([1-9][0-9]*)\}/);
          if (blankMatch) {
            const blankId = blankMatch[1];
            const answerText = answers[blankId];

            return (
              <span
                key={`blank-${blankId}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(blankId, e)}
                className={`${styles.blankSpace} ${!disabled && draggedOptionIndex !== null ? styles.dragActive : ''}`}
              >
                {answerText ? (
                  <Tag
                    type="blue"
                    filter={!disabled}
                    onClose={disabled ? undefined : () => handleRemoveAnswer(blankId)}
                  >
                    {answerText}
                  </Tag>
                ) : null}
              </span>
            );
          }
          return <span key={`text-${index}`}>{part}</span>;
        })}
      </p>
    </>
  );
};

export default FillInBlank;
