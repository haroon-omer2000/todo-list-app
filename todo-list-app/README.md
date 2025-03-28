# Todo List App

A serverless REST API for a simple Todo List application built with AWS API Gateway, Lambda, and DynamoDB using the Serverless Framework.

## Features

- **Create**: Add a new todo (POST /todos)
- **Read**: Get all todos (GET /todos) or a single todo (GET /todos/{id})
- **Update**: Modify a todo (PUT /todos/{id})
- **Delete**: Remove a todo (DELETE /todos/{id})

## Prerequisites

- AWS Account with configured credentials
- Node.js (v14+)
- Serverless Framework (`npm install -g serverless`)
- AWS CLI
- Git and GitHub account

## Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/todo-list-app.git
   cd todo-list-app