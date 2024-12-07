# Fee Management API Documentation

## Overview
This document provides detailed information about the fee management endpoints in the Thrift App API.

## Base URL
```
/api/v1
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

## Endpoints

### Calculate Fee
```http
POST /fees/calculate
```

Calculates the service fee for a given transaction.

#### Request Body
```json
{
  "amount": 1000,
  "userId": "string",
  "groupId": "string",
  "calculationType": "STANDARD",
  "options": {
    "season": "PEAK",
    "timeOfDay": 14
  }
}
```

#### Available Calculation Types
- STANDARD: Basic percentage or flat fee
- DYNAMIC_TIERED: Dynamic tier-based fees
- SEASONAL: Season-dependent fees
- GROUP_SIZE_BASED: Fees based on group size
- ACTIVITY_BASED: User activity-based fees
- TIME_BASED: Time of day-based fees
- COMBINED: Weighted combination of multiple methods

#### Response
```json
{
  "feeAmount": 15.00,
  "calculationMethod": "DYNAMIC_TIERED",
  "details": {
    "tier": "SILVER",
    "rate": 1.5,
    "nextTier": "GOLD"
  },
  "totalAmount": 1015.00
}
```

### Process Refund
```http
POST /fees/refund
```

Processes a refund for a service fee.

#### Request Body
```json
{
  "feeId": "string",
  "amount": 10.00,
  "reason": "CUSTOMER_REQUEST",
  "notes": "string"
}
```

#### Available Refund Reasons
- SYSTEM_ERROR
- OVERCHARGE
- CUSTOMER_REQUEST
- LOYALTY_ADJUSTMENT
- PROMOTIONAL_CREDIT

#### Response
```json
{
  "refundId": "string",
  "status": "COMPLETED",
  "amount": 10.00,
  "processedAt": "2024-12-07T10:00:00Z"
}
```

### Get Fee Analytics
```http
GET /fees/analytics
```

Retrieves comprehensive fee analytics.

#### Query Parameters
```
startDate: ISO date string
endDate: ISO date string
groupId: string (optional)
metrics: array of strings (optional)
```

#### Available Metrics
- revenue
- users
- groups
- time
- trends
- forecasts

#### Response
```json
{
  "revenueMetrics": {
    "totalRevenue": 50000.00,
    "netRevenue": 48500.00,
    "averageFee": 15.00,
    "refundRate": 0.03
  },
  "userMetrics": {
    "topUsers": [],
    "userDistribution": {}
  },
  "timeMetrics": {
    "hourlyDistribution": [],
    "dailyDistribution": [],
    "monthlyDistribution": []
  },
  "trendAnalysis": {
    "trend": "UPWARD",
    "seasonality": {}
  },
  "forecasting": {
    "nextMonth": {
      "predicted": 52000.00,
      "confidence": 0.85
    }
  }
}
```

### Generate Fee Report
```http
POST /fees/reports
```

Generates a detailed fee report.

#### Request Body
```json
{
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z",
  "format": "PDF",
  "groupBy": "day",
  "includeDetails": true,
  "email": "admin@example.com"
}
```

#### Available Formats
- PDF
- CSV
- JSON

#### Available Group By Options
- day
- week
- month

#### Response
```json
{
  "reportId": "string",
  "downloadUrl": "string",
  "generatedAt": "2024-12-07T10:00:00Z"
}
```

## Error Responses

All endpoints may return the following errors:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

### Common Error Codes
- INVALID_REQUEST: Malformed request or invalid parameters
- UNAUTHORIZED: Authentication required or invalid token
- FORBIDDEN: Insufficient permissions
- NOT_FOUND: Resource not found
- VALIDATION_ERROR: Request validation failed
- PROCESSING_ERROR: Error during fee processing

## Rate Limiting

API requests are limited to:
- 100 requests per minute for fee calculations
- 50 requests per minute for analytics
- 10 requests per minute for report generation

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1607346000
```
