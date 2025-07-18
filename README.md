<div align="center">
<!--   <img src="https://github.com/ijanhv/dockify-api/raw/main/public/logo.png" alt="Dockify Logo" width="200"/> -->
  <h1>Zipped</h1>
  <p><strong>Automate multiple workflows with Zipped!</strong></p>
</div>

## Overview

This is Zipped built using Node.js and Express with a microservices architecture. It enables users to create, manage, and execute automated workflows (zips) that involve various actions and triggers. The architecture is designed for scalability, reliability, and maintainability, leveraging Kafka for event-driven communication between services.

## Architecture
![image](https://github.com/user-attachments/assets/919fd0e4-aab0-4e60-aa01-17fba900b5c5)

### Microservices Overview

The application follows a microservices architecture, where each service is responsible for a specific functionality:

- **Primary Backend**: Handles user authentication, and CRUD operations for actions, triggers, and zips.
- **Hooks Service**: Executes zips based on triggers and logs the execution.
- **Processor Service**: Monitors `ZipRun` and `ZipOutbox` tables and sends messages to Kafka for further processing.
- **Worker Service**: Consumes messages from Kafka and executes the respective actions.

### Service Communication

The services interact using REST APIs and Kafka topics, ensuring loose coupling and scalability. Kafka acts as the communication backbone, facilitating event-driven processing.

- **REST APIs**: Used for synchronous communication between services (e.g., user management, zip creation).
- **Kafka**: Used for asynchronous, event-driven communication (e.g., zip execution, results processing).

### Transactional Outbox Pattern
This project implements the transactional outbox pattern to ensure reliable message delivery between services. The outbox pattern helps maintain data consistency across microservices by:

- Storing outgoing messages in a local "outbox" table within the same transaction as the business logic.
- Using a separate process (the Processor Service) to read from the outbox table and publish messages to Kafka.
- Ensuring that messages are only marked as processed after successful publication to Kafka.

This approach guarantees that messages are not lost due to network issues or service failures, providing at-least-once delivery semantics.

## Services

### Primary Backend

- **Authentication**: Manages user sign-up, login, and session management.
- **Zip Management**: Allows users to create, update, and delete zips. Each zip is associated with specific triggers and actions and is stored in the `Zip` table.

### Hooks Service

- **Trigger Execution**: This service initiates the execution of a zip when a trigger condition is met.
- **Zip Execution**: Runs the zip and logs the execution in the `ZipRun` and `ZipOutbox` tables for further processing.

### Processor Service

- **Monitoring**: Continuously checks the `ZipOutbox` table for new entries indicating zips ready for execution.
- **Kafka Integration**: Pushes zip execution data to Kafka, making it available for the Worker service to consume.

### Worker Service

- **Kafka Consumer**: Listens to the `zip-execution` topic on Kafka for zip execution instructions.
- **Action Execution**: Executes the actions associated with a zip and records the results.

## Kafka Integration

Kafka is used to handle asynchronous communication between services, ensuring that the processor service is not overloaded and zips are executed reliably and efficiently.

- **zip-execution**: Used by the Processor service to push zip execution instructions for the Worker service to consume.
- **zip-result**: Used by the Worker service to push the results of executed zips.

## Tech Stack

| Technology      | Purpose                                             |
|-----------------|-----------------------------------------------------|
| **Node.js**     | JavaScript runtime for server-side logic            |
| **Express.js**  | Web framework for building APIs                     |
| **Nextjs**      | Frontend                                            |
| **Kafka**       | Event streaming platform for inter-service communication |
| **Prisma**           | ORM for database modeling and queries with PostgreSQL     |
| **PostgreSQL**       | Relational database for storing users, zips, triggers, and actions |
| **Docker**      | Containerization for consistent environments        |
| **Docker Compose** | Orchestrates multi-container Docker applications  |

## Running the Project

### Prerequisites

- Docker and Docker Compose
- Node.js and npm
- Postgres 
- Prisma
- Next.js

### Steps

1. **Clone the Repository**:
  ```bash
  git clone https://github.com/AyushSriv06/zipped.git
  cd zipped
