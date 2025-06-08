# Migration from QStash to Render Cron Jobs

This document outlines the migration from Upstash QStash to Render Cron Jobs for scheduled blog generation.

## Overview

We've migrated from QStash to Render's Cron Job service for scheduling blog generation. This provides:

1. Simplified architecture (one less external dependency)
2. More reliable execution with Render's dedicated cron infrastructure
3. Lower costs and simplified billing
4. Better monitoring through Render's dashboard

## How It Works

### Render Cron Jobs Configuration

Cron jobs are defined in the `render.yaml` file:
- `execute-schedules`: Runs every 15 minutes to check for and process due schedules
- `health-check`: Runs every 6 hours to verify system health

Each cron job makes an HTTP request to a secured API endpoint in our application.

### API Endpoints

1. `/api/schedules/execute` - Processes all due schedules
2. `/api/schedules/health-check` - Performs system health checks
3. `/api/schedules/create` - Creates or updates schedules
4. `/api/schedules/cancel` - Cancels active schedules
5. `/api/schedules/repair` - Admin endpoint for repairing schedule issues

### Database Changes

We now use the database to track schedules rather than an external scheduling service. The key fields:
- `next_run`: When the schedule should next execute
- `is_active`: Whether the schedule is active
- The `qstash_message_id` field is no longer used

## Required Environment Variables

In Render Dashboard, set these environment variables:
- `CRON_SECRET`: A secret token used to secure cron endpoints
- `API_URL`: The URL of your application (e.g., https://your-app.onrender.com)
- `ADMIN_REPAIR_TOKEN`: Token for admin repair operations

## Testing

To test the cron job locally:

1. Set up the environment variables
2. Call the API endpoints directly with the proper Authorization header:
   ```
   curl -X GET "http://localhost:3000/api/schedules/execute" \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

## Monitoring

The system logs all executions to:
- `schedule_logs` table for individual execution results
- `system_logs` table for health checks and system events

You can also monitor cron job executions in the Render dashboard.

## Troubleshooting

If schedules aren't running:

1. Check Render's cron job logs in the dashboard
2. Verify the cron job is configured correctly in render.yaml
3. Ensure the CRON_SECRET and API_URL environment variables are set correctly
4. Check your application logs for API endpoint responses
5. Verify schedules have correct `next_run` dates in the database
6. Use the `/api/schedules/repair` endpoint to fix any invalid schedules
