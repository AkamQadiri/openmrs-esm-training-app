import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FileUploader, InlineNotification, InlineLoading } from '@carbon/react';
import { showToast, useConfig } from '@openmrs/esm-framework';
import { type Config } from '../config-schema';
import { bulkCreateStudents } from '../resources/user.resource';
import type { StudentRecord, BulkCreationResponse } from '../types/user';
import DataTableWrapper from '../components/data-table-wrapper.component';
import styles from './bulk-student-creation.scss';
import { csvRowToObject, parseCSV } from '../utils/csv-parser';

export interface ValidationError {
  row: number;
  record: StudentRecord;
  errors: string[];
}

export interface ValidationResult {
  valid: StudentRecord[];
  invalid: ValidationError[];
}

export function validateStudents(records: StudentRecord[], t: (key: string) => string): ValidationResult {
  const valid: StudentRecord[] = [];
  const invalid: ValidationError[] = [];

  records.forEach((record, index) => {
    const errors: string[] = [];

    if (!record.username?.trim()) {
      errors.push(t('usernameRequired'));
    }

    if (!record.givenName?.trim()) {
      errors.push(t('givenNameRequired'));
    }

    if (!record.gender || !['M', 'F', 'm', 'f'].includes(record.gender)) {
      errors.push(t('genderMustBeMOrF'));
    }

    if (errors.length > 0) {
      invalid.push({ row: index + 2, record, errors });
    } else {
      valid.push(record);
    }
  });

  return { valid, invalid };
}

function mapToStudentRecord(obj: Record<string, string>): StudentRecord {
  return {
    username: obj.username || '',
    givenName: obj.givenname || obj.given_name || obj.firstname || obj.first_name || '',
    familyName: obj.familyname || obj.family_name || obj.lastname || obj.last_name || '',
    gender: obj.gender || '',
    password: obj.password || '',
  };
}

export function parseStudentCSV(text: string): StudentRecord[] {
  const { headers, rows } = parseCSV(text);

  if (headers.length === 0 || rows.length === 0) {
    return [];
  }

  return rows.map((row) => csvRowToObject(headers, row, mapToStudentRecord));
}

const BulkStudentCreation: React.FC = () => {
  const { t } = useTranslation();
  const config: Config = useConfig();

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [createResult, setCreateResult] = useState<BulkCreationResponse | null>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.name.endsWith('.csv')) {
        showToast({
          title: t('invalidFileType'),
          description: t('pleaseSelectCSVFile'),
          kind: 'error',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const parsed = parseStudentCSV(text);

          if (parsed.length === 0) {
            showToast({
              title: t('emptyFile'),
              description: t('csvFileContainsNoRecords'),
              kind: 'warning',
            });
            return;
          }

          const result = validateStudents(parsed, t);
          setValidationResult(result);
          setCreateResult(null);
        } catch (error) {
          showToast({
            title: t('parseError'),
            description: t('failedToParseCSV'),
            kind: 'error',
          });
        }
      };

      reader.readAsText(file);
    },
    [t],
  );

  const handleBulkCreate = useCallback(async () => {
    if (!validationResult?.valid.length) return;

    setIsProcessing(true);
    try {
      const response = await bulkCreateStudents(
        validationResult.valid,
        config.defaultStudentPassword,
        config.defaultStudentLocation,
      );
      setCreateResult(response.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('unexpectedError');

      showToast({
        title: t('bulkCreationFailed'),
        description: errorMessage,
        kind: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [validationResult, config.defaultStudentPassword, config.defaultStudentLocation, t]);

  const handleFileDelete = useCallback(() => {
    setValidationResult(null);
    setCreateResult(null);
  }, []);

  return (
    <article className={styles.bulkCreationContainer}>
      <header>
        <h1>{t('bulkStudentCreation')}</h1>
      </header>

      <InstructionsSection config={config} />

      <FileUploader
        accept={['.csv']}
        buttonLabel={t('selectCSVFile')}
        filenameStatus="edit"
        labelDescription={t('csvFormatDescription')}
        labelTitle={t('uploadCSV')}
        onChange={handleFileChange}
        onDelete={handleFileDelete}
        disabled={isProcessing}
        className={styles.fileUpload}
      />

      {!createResult && validationResult && (
        <>
          {validationResult.invalid.length > 0 && <InvalidRecordsSection validation={validationResult} />}
          {validationResult.valid.length > 0 && (
            <ValidRecordsSection
              validation={validationResult}
              config={config}
              onSubmit={handleBulkCreate}
              isProcessing={isProcessing}
            />
          )}
        </>
      )}

      {isProcessing && <InlineLoading description={t('creatingStudents')} />}

      {createResult && !isProcessing && <ResultsSection result={createResult} validation={validationResult} />}
    </article>
  );
};

const InstructionsSection: React.FC<{ config: Config }> = ({ config }) => {
  const { t } = useTranslation();

  return (
    <section className={styles.instructionsSection}>
      <h2>{t('instructions')}</h2>
      <p>{t('csvInstructions')}</p>
      <ul>
        <li>
          <strong>username</strong> ({t('required')})
        </li>
        <li>
          <strong>givenName</strong> ({t('required')})
        </li>
        <li>
          <strong>gender</strong> ({t('required')}, M/F)
        </li>
        <li>
          <strong>familyName</strong> ({t('optional')})
        </li>
        <li>
          <strong>password</strong> ({t('optional')}, {t('defaultsTo')} {config.defaultStudentPassword})
        </li>
      </ul>
      <p>
        <strong>{t('csvExample')}:</strong>
      </p>
      <pre>username,givenName,familyName,gender,password{'\n'}john_doe,John,Doe,M,</pre>
    </section>
  );
};

const InvalidRecordsSection: React.FC<{ validation: ValidationResult }> = ({ validation }) => {
  const { t } = useTranslation();

  const headers = [
    { key: 'row', header: t('row') },
    { key: 'username', header: t('username') },
    { key: 'givenName', header: t('givenName') },
    { key: 'familyName', header: t('familyName') },
    { key: 'gender', header: t('gender') },
    { key: 'password', header: t('password') },
    { key: 'errors', header: t('errors') },
  ];

  const rows = validation.invalid.map((item, index) => ({
    id: `invalid-${index}`,
    row: item.row,
    username: item.record.username || '-',
    givenName: item.record.givenName || '-',
    familyName: item.record.familyName || '-',
    gender: item.record.gender || '-',
    password: item.record.password ? '********' : '-',
    errors: item.errors.join(', '),
  }));

  return (
    <aside className={styles.invalidRecords}>
      <InlineNotification
        kind="error"
        title={t('invalidRecords')}
        subtitle={t('fixErrorsBeforeProceeding', { count: validation.invalid.length })}
        lowContrast
      />
      <DataTableWrapper rows={rows} headers={headers} title={t('invalidStudents')} />
    </aside>
  );
};

const ValidRecordsSection: React.FC<{
  validation: ValidationResult;
  config: Config;
  onSubmit: () => void;
  isProcessing: boolean;
}> = ({ validation, config, onSubmit, isProcessing }) => {
  const { t } = useTranslation();

  const headers = [
    { key: 'username', header: t('username') },
    { key: 'givenName', header: t('givenName') },
    { key: 'familyName', header: t('familyName') },
    { key: 'gender', header: t('gender') },
    { key: 'password', header: t('password') },
  ];

  const rows = validation.valid.map((student, index) => ({
    id: `valid-${index}`,
    ...student,
    familyName: student.familyName || '-',
    password: student.password ? '********' : config.defaultStudentPassword,
  }));

  return (
    <aside className={styles.validRecords}>
      <InlineNotification
        kind="success"
        title={t('validRecords')}
        subtitle={t('readyToCreate', { count: validation.valid.length })}
        lowContrast
      />
      <DataTableWrapper rows={rows} headers={headers} title={t('validStudents')} />
      <Button kind="primary" onClick={onSubmit} disabled={isProcessing}>
        {isProcessing ? t('creating') : t('createStudents', { count: validation.valid.length })}
      </Button>
    </aside>
  );
};

const ResultsSection: React.FC<{ result: BulkCreationResponse; validation: ValidationResult }> = ({
  result,
  validation,
}) => {
  const { t } = useTranslation();

  const headers = [
    { key: 'username', header: t('username') },
    { key: 'givenName', header: t('givenName') },
    { key: 'familyName', header: t('familyName') },
    { key: 'gender', header: t('gender') },
    { key: 'created', header: t('created') },
    { key: 'error', header: t('error') },
    { key: 'warning', header: t('warning') },
  ];

  const rows = result.results.map((item, index) => {
    const student = validation.valid.find((s) => s.username === item.username);
    return {
      id: `result-${index}`,
      username: item.username,
      givenName: student?.givenName || '-',
      familyName: student?.familyName || '-',
      gender: student?.gender || '-',
      created: item.success ? t('yes') : t('no'),
      error: item.error || '-',
      warning: item.warning || '-',
    };
  });

  return <DataTableWrapper rows={rows} headers={headers} title={t('bulkCreateResult')} />;
};

export default BulkStudentCreation;
