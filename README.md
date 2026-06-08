# OpenMRS Training App

OpenMRS 3.x microfrontend for managing and delivering training courses.

## Overview

The Training App is a learning module for OpenMRS, featuring:

* **Exercises**: Multiple choice, true/false, fill-in-blank, matching, ordering, concept creation, and form creation exercises
* **Progress Tracking**: Monitor learner progress and completion rates
* **Analytics Dashboard**: View course and user performance metrics
* **Bulk User Creation**: Import students via CSV

## Getting Started

### Prerequisites

* Node.js (version 18 or later recommended)
* yarn

### Installation

```bash
yarn install
```

### Running the App

```bash
yarn start
```

This launches a dev server for the OpenMRS SPA with the Training app. Access it at:

```
http://localhost:8080/openmrs/spa/training
```

### Running Tests

```bash
# Run all tests
yarn test

# Run tests for a specific module
yarn turbo test --filter="@openmrs/esm-training-app"

# Run tests in watch mode
yarn test --watch

# Run tests without cache
yarn turbo test --force
```

## Configuration

The app supports the following configuration options:

```json
{
  "@openmrs/esm-training-app": {
    "defaultStudentPassword": "Temp123!",
    "defaultStudentLocation": "Site 1",
    "maxFileUploadSizeMB": 50,
    "supportedMediaTypes": [
      "image/jpeg",
      "image/png",
      "video/mp4",
      "application/pdf"
    ]
  }
}
```

## Backend Dependencies

Requires the OpenMRS Training backend module (version 1.0.0 or later):

```
https://github.com/akamqadiri/openmrs-module-training
```

## Deployment

See the [deployment guide](https://o3-docs.openmrs.org/) for information on deploying frontend modules.

## Future Features

* **Course Management**: Create and organize courses with lessons and exercises

## Resources

* [OpenMRS 3.0 Frontend Documentation](https://o3-docs.openmrs.org/)
* [OpenMRS Forum](https://talk.openmrs.org/)
* [Contributing Guide](https://o3-dev.docs.openmrs.org/docs/frontend-modules/contributing)

## License

MPL-2.0
