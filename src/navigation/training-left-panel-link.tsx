import { ConfigurableLink, userHasAccess, useSession } from '@openmrs/esm-framework';
import last from 'lodash-es/last';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { isValidUUID } from '../utils/helpers';

interface LinkConfig {
  name: string;
  path: string;
}

const LinkExtension: React.FC<{ config: LinkConfig }> = ({ config }) => {
  const { name, path } = config;
  const { t } = useTranslation();
  const location = useLocation();

  let urlSegment = useMemo(() => decodeURIComponent(last(location.pathname.split('/')) || ''), [location.pathname]);

  // Handle UUID routes
  if (isValidUUID(urlSegment)) {
    urlSegment = 'courses';
  }

  return (
    <ConfigurableLink
      to={`${window.spaBase}/training/${path}`}
      className={`cds--side-nav__link ${path === urlSegment ? 'active-left-nav-link' : ''}`}
    >
      {t(name)}
    </ConfigurableLink>
  );
};

export const createLeftPanelLink = (name: string, path: string, requiredPrivilege?: string) => () => {
  const session = useSession();
  const hasPrivilege = userHasAccess(requiredPrivilege, session?.user);

  return (
    hasPrivilege && (
      <BrowserRouter>
        <LinkExtension config={{ name, path }} />
      </BrowserRouter>
    )
  );
};
