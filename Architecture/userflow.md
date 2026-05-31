# User Flow

## Event Registration Process

1. User opens the Event Registration page.
2. User views available events.
3. User enters:
   - Event Name
   - Email Address
4. User clicks the Register button.
5. The registration request is sent to Amazon API Gateway.
6. API Gateway triggers an AWS Lambda function.
7. Lambda validates the registration information.
8. Registration details are stored in Amazon DynamoDB.
9. CloudWatch records logs and monitoring information.
10. The system returns a success message to the user.
11. (Optional) Amazon SNS sends a confirmation email.
