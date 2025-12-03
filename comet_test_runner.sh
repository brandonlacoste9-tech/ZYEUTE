#!/bin/bash

BASE_URL="http://localhost:3000/v1/test"
RESULTS=()

# Test 1: Health Check
echo "=== Test 1: Health Check ==="
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${BASE_URL}/health" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')
echo "Status Code: $HTTP_CODE"
echo "Response: $BODY"
echo ""

# Test 2: Create Test Task
echo "=== Test 2: Create Test Task ==="
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TASK_BODY="{\"description\": \"Test task from Comet - ${TIMESTAMP}\", \"priority\": \"high\"}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$TASK_BODY" \
  "${BASE_URL}/task" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')
TASK_ID=$(echo "$BODY" | grep -o '"id":"[^"]*"' | cut -d'"' -f4 || echo "")
echo "Status Code: $HTTP_CODE"
echo "Response: $BODY"
echo "Task ID: $TASK_ID"
echo ""

# Test 3: List Test Tasks
echo "=== Test 3: List Test Tasks ==="
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${BASE_URL}/tasks" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')
echo "Status Code: $HTTP_CODE"
echo "Response: $BODY"
echo ""

# Test 4: System Statistics
echo "=== Test 4: System Statistics ==="
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${BASE_URL}/stats" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')
echo "Status Code: $HTTP_CODE"
echo "Response: $BODY"
echo ""

# Test 5: Save Test Memory
echo "=== Test 5: Save Test Memory ==="
MEMORY_KEY="comet_test_$(date +%s)"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
MEMORY_BODY="{\"key\": \"${MEMORY_KEY}\", \"value\": {\"test\": true, \"message\": \"Hello from Comet!\", \"timestamp\": \"${TIMESTAMP}\", \"agent\": \"Comet\"}}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$MEMORY_BODY" \
  "${BASE_URL}/memory" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')
echo "Status Code: $HTTP_CODE"
echo "Response: $BODY"
echo "Memory Key: $MEMORY_KEY"
echo ""

# Test 6: Retrieve Test Memory
echo "=== Test 6: Retrieve Test Memory ==="
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${BASE_URL}/memory/${MEMORY_KEY}" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')
echo "Status Code: $HTTP_CODE"
echo "Response: $BODY"
echo "Key Used: $MEMORY_KEY"
echo ""
