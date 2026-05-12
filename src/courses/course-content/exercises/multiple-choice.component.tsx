import { RadioButton, RadioButtonGroup } from '@carbon/react';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { type Exercise, type MultipleChoiceContent } from '../../../types';
import { getLocalizedText } from '../../../utils/helpers';

interface MultipleChoiceProps {
  exercise: Exercise;
  onChoiceChanged: (response: { selectedOption: string } | null) => void;
  disabled?: boolean;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({ exercise, onChoiceChanged, disabled = false }) => {
  const { t, i18n } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string>('');

  const content = exercise.content as MultipleChoiceContent;

  const handleSelectionChange = useCallback(
    (value: string) => {
      if (disabled) return;
      setSelectedOption(value);
      onChoiceChanged({ selectedOption: value });
    },
    [onChoiceChanged, disabled],
  );

  const question = getLocalizedText(i18n.language, content.question);

  return (
    <>
      <h2>{question}</h2>

      <RadioButtonGroup
        legendText={t('selectAnAnswer')}
        name="multiple-choice-options"
        valueSelected={selectedOption}
        onChange={handleSelectionChange}
        orientation="vertical"
        disabled={disabled}
      >
        {content.options.map((option) => {
          const optionText = getLocalizedText(i18n.language, option.text);
          return <RadioButton key={option.id} id={`option-${option.id}`} labelText={optionText} value={option.id} />;
        })}
      </RadioButtonGroup>
    </>
  );
};

export default MultipleChoice;
