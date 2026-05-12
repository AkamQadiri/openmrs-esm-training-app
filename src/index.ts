/**
 * This is the entrypoint file of the application. It communicates the
 * important features of this microfrontend to the app shell. It
 * connects the app shell to the React application(s) that make up this
 * microfrontend.
 */
import { getAsyncLifecycle, defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import {
  PRIVILEGE_MANAGE_TRAINING,
  PRIVILEGE_PARTICIPATE_TRAINING,
  PRIVILEGE_VIEW_TRAINING_ANALYTICS,
} from './constants/privileges';
import { createLeftPanelLink } from './navigation/training-left-panel-link';
import TrainingLink from './navigation/training-link.component';

const moduleName = '@openmrs/esm-training-app';

const options = {
  featureName: 'training',
  moduleName: moduleName,
};

/**
 * This tells the app shell how to obtain translation files: that they
 * are JSON files in the directory `../translations` (which you should
 * see in the directory structure).
 */
export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

/**
 * This function performs any setup that should happen at microfrontend
 * load-time (such as defining the config schema) and then returns an
 * object which describes how the React application(s) should be
 * rendered.
 */
export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

/**
 * This named export tells the app shell that the default export of `root.component.tsx`
 * should be rendered when the route matches `root`. The full route
 * will be `openmrsSpaBase() + 'root'`, which is usually
 * `/openmrs/spa/root`.
 */
export const root = getAsyncLifecycle(() => import('./root.component'), options);

export const trainingLink = getSyncLifecycle(TrainingLink, options);
export const dashboardLeftPanelLink = getSyncLifecycle(
  createLeftPanelLink('dashboard', 'dashboard', PRIVILEGE_PARTICIPATE_TRAINING),
  options,
);
export const coursesLeftPanelLink = getSyncLifecycle(
  createLeftPanelLink('courses', 'courses', PRIVILEGE_PARTICIPATE_TRAINING),
  options,
);
export const analyticsLeftPanelLink = getSyncLifecycle(
  createLeftPanelLink('analytics', 'analytics', PRIVILEGE_VIEW_TRAINING_ANALYTICS),
  options,
);
export const bulkCreateStudentsLeftPanelLink = getSyncLifecycle(
  createLeftPanelLink('bulkCreateStudents', 'bulk-create-students', PRIVILEGE_MANAGE_TRAINING),
  options,
);
