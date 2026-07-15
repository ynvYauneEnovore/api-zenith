# Zenith API

## Overview
Zenith API is a robust, scalable, and highly available backend system designed and developed by Yovan Enovore for ENCORP. Built using the NestJS framework, this repository serves as the core infrastructure for enterprise-level applications, ensuring optimal performance and seamless integration.

## Architecture
This project utilizes modern TypeScript, leveraging Node.js and the NestJS framework to provide a modular and maintainable structure. PM2 is integrated directly into the core services to manage process execution, zero-downtime reloads, auto-scaling, and advanced application monitoring.

## System Requirements
- Node.js (Version 22 or higher recommended)
- Bun or pnpm for dependency management

## Installation
Execute the following command to install the required dependencies:

```bash
bun install
```

## Running the Application
The application can be executed in different environments based on your deployment strategy:

```bash
# Development mode
bun run start

# Watch mode (Development)
bun run start:dev

# Production mode
bun run start:prod
```

## Testing Framework
Ensure code reliability by executing the test suites:

```bash
# Unit tests
bun run test

# End-to-end tests
bun run test:e2e

# Code coverage reports
bun run test:cov
```

## Documentation
The API documentation is accessible via the built-in OpenAPI specification powered by Scalar. Once the application is running, navigate to:

`http://localhost:3000/docs`

## Licensing and Copyright
Copyright (c) ENCORP. All rights reserved.
Developed by Yovan Enovore.
