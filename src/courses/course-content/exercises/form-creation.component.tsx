import { Accordion, AccordionItem, TextInput } from '@carbon/react';
import { Copy } from '@carbon/react/icons';
import { showSnackbar, useSession } from '@openmrs/esm-framework';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { type Exercise, type FormCreationContent } from '../../../types';
import { getLocalizedText, isValidUUID } from '../../../utils/helpers';
import styles from './form-creation.scss';

interface FormCreationProps {
  exercise: Exercise;
  onChoiceChanged: (response: { formUuid: string } | null) => void;
  disabled?: boolean;
}

const FormCreation: React.FC<FormCreationProps> = ({ exercise, onChoiceChanged, disabled = false }) => {
  const { t, i18n } = useTranslation();
  const session = useSession();
  const [formUuid, setFormUuid] = useState<string>('');
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const content = exercise.content as FormCreationContent;
  const requirements = content.requirements;

  const handleUuidChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const value = e.target.value.trim();
      setFormUuid(value);

      if (value === '') {
        setIsInvalid(false);
        onChoiceChanged(null);
        return;
      }

      const valid = isValidUUID(value);
      setIsInvalid(!valid);
      onChoiceChanged(valid ? { formUuid: value } : null);
    },
    [onChoiceChanged, disabled],
  );

  const copyToClipboard = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text);
      showSnackbar({ title: t('copied'), kind: 'success', isLowContrast: true });
    },
    [t],
  );

  const renderField = (label: string, value: string | number, copyable: boolean = true, indent: number = 0) => (
    <div className={`${styles.requirementField} ${styles[`indent${indent}`]}`}>
      <dt>{label}:</dt>
      <dd>
        {value}
        {copyable && <Copy size={16} onClick={() => copyToClipboard(String(value))} className={styles.copyIcon} />}
      </dd>
    </div>
  );

  return (
    <>
      <header>
        <h2>{t('requirements')}</h2>
      </header>

      <dl className={styles.requirementsList}>
        {renderField(t('name'), getLocalizedText(i18n.language, requirements.name) + ' - ' + session?.user.username)}

        {renderField(t('description'), getLocalizedText(i18n.language, requirements.description))}

        {renderField(t('version'), requirements.version)}

        {renderField(t('encounterType'), requirements.encounterType, false)}

        {requirements.published !== undefined &&
          renderField(t('published'), requirements.published ? t('yes') : t('no'), false)}

        {requirements.pages.map((page, pageIndex) => (
          <div key={pageIndex} className={styles.pageSection}>
            {renderField(`${t('page')} ${pageIndex + 1}`, getLocalizedText(i18n.language, page.label))}

            {page.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className={styles.sectionGroup}>
                {renderField(
                  `${t('section')} ${sectionIndex + 1}`,
                  getLocalizedText(i18n.language, section.label),
                  true,
                  1,
                )}

                {section.isExpanded !== undefined &&
                  renderField(t('keepSectionExpanded'), section.isExpanded ? t('yes') : t('no'), false, 1)}

                {section.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className={styles.questionGroup}>
                    {renderField(t('questionLabel'), getLocalizedText(i18n.language, question.label), true, 2)}
                    {renderField(t('questionId'), getLocalizedText(i18n.language, question.id), true, 2)}
                    {renderField(t('questionType'), question.type, false, 2)}
                    {renderField(t('renderingType'), question.questionOptions.rendering, false, 2)}
                    {question.required !== undefined &&
                      renderField(t('required'), question.required ? t('yes') : t('no'), false, 2)}
                    {renderField(
                      t('concept'),
                      getLocalizedText(i18n.language, question.questionOptions.concept.name),
                      true,
                      2,
                    )}
                    {question.questionOptions.min && renderField(t('min'), question.questionOptions.min, true, 2)}
                    {question.questionOptions.max && renderField(t('max'), question.questionOptions.max, true, 2)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </dl>

      <aside className={styles.helpSection}>
        <Accordion>
          <AccordionItem title={t('help')}>
            <article>
              <h3>{t('howToNavigateFormBuilder')}</h3>
              <ol>
                <li>{t('formNavigateStep1')}</li>
                <li>{t('formNavigateStep2')}</li>
                <li>{t('formNavigateStep3')}</li>
                <li>{t('formNavigateStep4')}</li>
                <li>{t('formNavigateStep5')}</li>
                <li>{t('formNavigateStep6')}</li>
              </ol>

              <h3>{t('howToCreateBasicForm')}</h3>
              <ol>
                <li>{t('formCreateStep1')}</li>
                <li>{t('formCreateStep2')}</li>
                <li>{t('formCreateStep3')}</li>
                <li>{t('formCreateStep4')}</li>
                <li>{t('formCreateStep5')}</li>
                <li>{t('formCreateStep6')}</li>
                <li>{t('formCreateStep7')}</li>
                <li>{t('formCreateStep8')}</li>
                <li>{t('formCreateStep9')}</li>
              </ol>

              <h3>{t('howToGetFormUuid')}</h3>
              <p>{t('formUuidDescription')}</p>

              <h3>{t('additionalResources')}</h3>
              <p>
                {t('formAdditionalResourcesDescription')}{' '}
                <a
                  href="https://o3-docs.openmrs.org/docs/forms-in-o3/build-forms-with-o3-form-builder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                >
                  {t('formManagementGuide')}
                </a>
              </p>
            </article>
          </AccordionItem>
        </Accordion>
      </aside>

      <footer className={styles.submissionSection}>
        <TextInput
          id="form-uuid-input"
          labelText={t('formUuid')}
          placeholder={t('enterFormUuid')}
          value={formUuid}
          onChange={handleUuidChange}
          helperText={t('uuidFormat')}
          disabled={disabled}
          invalid={isInvalid}
          invalidText={t('invalidUuidFormat')}
        />
      </footer>
    </>
  );
};

export default FormCreation;
