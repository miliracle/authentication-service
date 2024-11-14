# Authentication Service

## Prerequisites

- Node.js v18
- Docker and Docker Compose

## Setup Instructions

1. Create a `.env` file in the root of the project and add the following:

    ```bash
    NODE_ENV=development
    AUTH_SERVICE_PORT=4001
    RABBITMQ_USER=guest
    RABBITMQ_PASSWORD=guest
    RABBITMQ_SERVICE_NAME=app-rabbitmq-message-queue
    RABBITMQ_PORT=5672
    RABBITMQ_MANAGEMENT_PORT=15672
    ```

2. Install dependencies:

    ```bash
    yarn install
    ```

3. Start the services using Docker Compose:

    ```bash
    docker-compose -f docker-compose.dev.yml up 
    ```

4. Access the authentication service at `http://localhost:<port>` (replace `<port>` with the AUTH_SERVICE_PORT specified in your .env file).
