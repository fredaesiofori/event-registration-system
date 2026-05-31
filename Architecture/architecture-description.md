# Event Registration & Ticketing System Architecture

## Overview

This project uses a serverless AWS architecture.

## Components

- Frontend Registration Form
- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB
- Amazon CloudWatch
- Amazon SNS (Optional)

## Data Flow

User submits registration form.

API Gateway receives the request.

AWS Lambda processes the request.

DynamoDB stores registration data.

CloudWatch records logs and monitoring information.

SNS sends confirmation emails.
