import { userHasAccess } from '@openmrs/esm-api';
import { ConfigurableLink, useSession } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  PRIVILEGE_MANAGE_TRAINING,
  PRIVILEGE_PARTICIPATE_TRAINING,
  PRIVILEGE_VIEW_TRAINING_ANALYTICS,
} from '../constants/privileges';

const TrainingLink: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();
  const canParticipate = userHasAccess(PRIVILEGE_PARTICIPATE_TRAINING, session?.user);
  const canManage = userHasAccess(PRIVILEGE_MANAGE_TRAINING, session?.user);
  const canViewAnalytics = userHasAccess(PRIVILEGE_VIEW_TRAINING_ANALYTICS, session?.user);

  if (!canParticipate && !canManage && !canViewAnalytics) {
    return <></>;
  }

  return <ConfigurableLink to={`${window.spaBase}/training`}>{t('training')}</ConfigurableLink>;
};

export default TrainingLink;
