import { Accordion, AccordionItem, TextInput } from '@carbon/react';
import { Copy } from '@carbon/react/icons';
import { showSnackbar, useSession } from '@openmrs/esm-framework';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { type Exercise, type ConceptCreationContent } from '../../../types';
import { getLocalizedText, isValidUUID } from '../../../utils/helpers';
import styles from './concept-creation.scss';

interface ConceptCreationProps {
  exercise: Exercise;
  onChoiceChanged: (response: { conceptUuid: string } | null) => void;
  disabled?: boolean;
}

const ConceptCreation: React.FC<ConceptCreationProps> = ({ exercise, onChoiceChanged, disabled = false }) => {
  const { t, i18n } = useTranslation();
  const session = useSession();
  const [conceptUuid, setConceptUuid] = useState<string>('');
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const content = exercise.content as ConceptCreationContent;
  const requirements = content.requirements;

  const handleUuidChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const value = e.target.value.trim();
      setConceptUuid(value);

      if (value === '') {
        setIsInvalid(false);
        onChoiceChanged(null);
        return;
      }

      const valid = isValidUUID(value);
      setIsInvalid(!valid);
      onChoiceChanged(valid ? { conceptUuid: value } : null);
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

  const renderField = (label: string, value: string | number, copyable: boolean = true) => (
    <div className={styles.requirementField}>
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
        {requirements.name?.primary &&
          renderField(
            t('fullySpecifiedName'),
            getLocalizedText(i18n.language, requirements.name.primary) + ' - ' + session?.user.username,
          )}

        {requirements.name?.synonyms?.map((synonym, index) =>
          renderField(`${t('synonym')} ${index + 1}`, getLocalizedText(i18n.language, synonym)),
        )}

        {requirements.name?.searchTerms?.map((term, index) =>
          renderField(`${t('searchTerm')} ${index + 1}`, getLocalizedText(i18n.language, term)),
        )}

        {requirements.name?.shortName &&
          renderField(t('shortName'), getLocalizedText(i18n.language, requirements.name.shortName))}

        {requirements.description &&
          renderField(t('description'), getLocalizedText(i18n.language, requirements.description))}

        {requirements.class && renderField(t('class'), requirements.class, false)}

        {requirements.isSet !== undefined && renderField(t('isSet'), requirements.isSet ? t('yes') : t('no'), false)}

        {requirements.setMembers?.map((member, index) =>
          renderField(`${t('setMember')} ${index + 1}`, getLocalizedText(i18n.language, member.conceptName)),
        )}

        {requirements.datatype && renderField(t('datatype'), requirements.datatype, false)}

        {requirements.numericProperties && (
          <>
            {requirements.numericProperties.hiAbsolute !== undefined &&
              renderField(t('absoluteHigh'), requirements.numericProperties.hiAbsolute)}
            {requirements.numericProperties.hiCritical !== undefined &&
              renderField(t('criticalHigh'), requirements.numericProperties.hiCritical)}
            {requirements.numericProperties.hiNormal !== undefined &&
              renderField(t('normalHigh'), requirements.numericProperties.hiNormal)}
            {requirements.numericProperties.lowNormal !== undefined &&
              renderField(t('normalLow'), requirements.numericProperties.lowNormal)}
            {requirements.numericProperties.lowCritical !== undefined &&
              renderField(t('criticalLow'), requirements.numericProperties.lowCritical)}
            {requirements.numericProperties.lowAbsolute !== undefined &&
              renderField(t('absoluteLow'), requirements.numericProperties.lowAbsolute)}
            {requirements.numericProperties.units && renderField(t('units'), requirements.numericProperties.units)}
            {requirements.numericProperties.allowDecimal !== undefined &&
              renderField(t('allowDecimal'), requirements.numericProperties.allowDecimal ? t('yes') : t('no'), false)}
            {requirements.numericProperties.displayPrecision !== undefined &&
              renderField(t('displayPrecision'), requirements.numericProperties.displayPrecision)}
          </>
        )}

        {requirements.codedProperties?.map((coded, index) =>
          renderField(`${t('answer')} ${index + 1}`, getLocalizedText(i18n.language, coded.conceptName)),
        )}

        {requirements.mappings?.map((mapping, index) =>
          renderField(
            `${t('mapping')} ${index + 1}`,
            `${mapping.relationship} | ${mapping.source} | ${mapping.code}`,
            false,
          ),
        )}

        {requirements.version && renderField(t('version'), requirements.version)}
      </dl>

      <aside className={styles.helpSection}>
        <Accordion>
          <AccordionItem title={t('help')}>
            <article>
              <h3>{t('howToNavigateConceptCreation')}</h3>
              <ol>
                <li>{t('conceptNavigateStep1')}</li>
                <li>{t('conceptNavigateStep2')}</li>
                <li>{t('conceptNavigateStep3')}</li>
                <li>{t('conceptNavigateStep4')}</li>
                <li>{t('conceptNavigateStep5')}</li>
              </ol>

              <h3>{t('howToCreateBasicConcept')}</h3>
              <ol>
                <li>{t('conceptCreateStep1')}</li>
                <li>{t('conceptCreateStep2')}</li>
                <li>{t('conceptCreateStep3')}</li>
              </ol>

              <h3>{t('importantNotes')}</h3>
              <p>{t('conceptAnswersNote')}</p>

              <h3>{t('howToEditConcept')}</h3>
              <p>{t('conceptEditDescription')}</p>

              <h3>{t('howToGetConceptUuid')}</h3>
              <p>{t('conceptUuidDescription')}</p>

              <h3>{t('additionalResources')}</h3>
              <p>
                {t('conceptAdditionalResourcesDescription')}{' '}
                <a
                  href="https://guide.openmrs.org/configuration/managing-concepts-and-metadata/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                >
                  {t('conceptManagementGuide')}
                </a>
              </p>
            </article>
          </AccordionItem>
        </Accordion>
      </aside>

      <footer className={styles.submissionSection}>
        <TextInput
          id="concept-uuid-input"
          labelText={t('conceptUuid')}
          placeholder={t('enterConceptUuid')}
          value={conceptUuid}
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

export default ConceptCreation;
