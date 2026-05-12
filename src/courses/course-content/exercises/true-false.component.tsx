import { RadioButton, RadioButtonGroup } from '@carbon/react';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { type Exercise, type TrueFalseContent } from '../../../types';
import { getLocalizedText } from '../../../utils/helpers';

interface TrueFalseProps {
  exercise: Exercise;
  onChoiceChanged: (response: { answer: boolean } | null) => void;
  disabled?: boolean;
}

const TrueFalse: React.FC<TrueFalseProps> = ({ exercise, onChoiceChanged, disabled = false }) => {
  const { t, i18n } = useTranslation();
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const content = exercise.content as TrueFalseContent;

  const handleSelectionChange = useCallback(
    (value: string) => {
      if (disabled) return;
      setSelectedAnswer(value);
      const answer = value === 'true';
      onChoiceChanged({ answer });
    },
    [onChoiceChanged, disabled],
  );

  const statement = getLocalizedText(i18n.language, content.statement);

  return (
    <>
      <h2>{statement}</h2>

      <RadioButtonGroup
        legendText={t('selectAnAnswer')}
        name="true-false-options"
        valueSelected={selectedAnswer}
        onChange={handleSelectionChange}
        orientation="vertical"
        disabled={disabled}
      >
        <RadioButton id="option-true" labelText={t('true')} value="true" />
        <RadioButton id="option-false" labelText={t('false')} value="false" />
      </RadioButtonGroup>
    </>
  );
};

export default TrueFalse;
