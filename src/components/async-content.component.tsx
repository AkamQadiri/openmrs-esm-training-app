import React, { type ReactNode } from 'react';
import { InlineLoading } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from './async-content.scss';

interface AsyncContentProps {
  isLoading?: boolean;
  loadingMessage?: string;
  error?: boolean | string | null;
  errorMessage?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
}

const AsyncContent: React.FC<AsyncContentProps> = ({
  isLoading = false,
  loadingMessage,
  error,
  errorMessage,
  isEmpty,
  emptyMessage,
  children,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <InlineLoading description={loadingMessage || t('loading')} />
      </div>
    );
  }

  if (error) {
    const message = typeof error === 'string' ? error : errorMessage;
    return (
      <div className={styles.errorContainer} role="alert">
        <p>{message}</p>
      </div>
    );
  }

  if (isEmpty && emptyMessage) {
    return (
      <div className={styles.emptyContainer}>
        <p>{emptyMessage || t('noData')}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AsyncContent;
