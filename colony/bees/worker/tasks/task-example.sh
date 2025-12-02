#!/bin/bash
# Example Colony OS Worker Bee Task Script
# 
# This is a template for creating new task scripts.
# Place your task scripts in: colony/bees/worker/tasks/
#
# Usage: The poller will execute this script when a task references it.

set -e  # Exit on error

echo "🐝 Colony Worker Bee Task: Example Task"
echo "========================================"
echo "Task started at: $(date)"
echo ""

# Your task logic here
echo "✅ Task completed successfully"
echo "Finished at: $(date)"

