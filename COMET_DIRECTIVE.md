# 🎯 **COMET: EXECUTE THIS DIRECTIVE**

**From:** Cursor AI (Implementation Team)  
**To:** Comet (Cursor Agents - Testing & Validation)  
**Date:** December 3, 2025  
**Priority:** HIGH  
**Status:** READY FOR EXECUTION  

---

## 🎯 **YOUR MISSION**

**Test Colony OS Kernel API end-to-end using browser automation.**

**I've built 6 test endpoints specifically for you. Your job is to validate they all work correctly.**

---

## 🚀 **EXECUTION STEPS**

### **STEP 1: Verify Colony OS is Running**

**Navigate to:**
```
http://localhost:3000/v1/test/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-03T...",
  "services": {
    "kernel": "online",
    "mind": "connected" | "not connected",
    "guardian": "connected" | "not connected"
  }
}
```

**Action:**
- ✅ If you get a valid JSON response → Continue to Step 2
- ❌ If you get an error → Report: "Colony OS not running" and STOP

---

### **STEP 2: Test 1 - Health Check**

**Endpoint:** `GET http://localhost:3000/v1/test/health`

**Validation:**
- ✅ Status code is `200 OK`
- ✅ Response is valid JSON
- ✅ `status` field equals `"healthy"`
- ✅ `timestamp` is present and valid

**Report:**
```
Test 1: Health Check
Status: [PASS/FAIL]
Response: [paste JSON response]
```

---

### **STEP 3: Test 2 - Create Test Task**

**Endpoint:** `POST http://localhost:3000/v1/test/task`

**Request Body:**
```json
{
  "description": "Test task from Comet - " + new Date().toISOString(),
  "priority": "high"
}
```

**Headers:**
```
Content-Type: application/json
```

**Expected Response:**
```json
{
  "success": true,
  "task": {
    "id": "uuid-here",
    "type": "test",
    "status": "pending",
    "priority": "high",
    "createdAt": "2025-12-03T..."
  },
  "message": "Test task created successfully"
}
```

**Validation:**
- ✅ Status code is `200 OK` or `201 Created`
- ✅ `success` is `true`
- ✅ Task has valid UUID `id`
- ✅ `status` is `"pending"`
- ✅ `priority` matches request

**IMPORTANT:** Save the task `id` for Step 3!

**Report:**
```
Test 2: Create Test Task
Status: [PASS/FAIL]
Task ID: [uuid]
Response: [paste JSON response]
```

---

### **STEP 4: Test 3 - List Test Tasks**

**Endpoint:** `GET http://localhost:3000/v1/test/tasks`

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "tasks": [
    {
      "id": "uuid-from-step-2",
      "status": "pending",
      "priority": "high",
      "semanticCategory": "GeneralBee",
      "createdAt": "2025-12-03T...",
      "assignedTo": null
    }
  ]
}
```

**Validation:**
- ✅ Status code is `200 OK`
- ✅ `success` is `true`
- ✅ `count` matches number of tasks
- ✅ Task from Step 2 appears in the list
- ✅ Task `id` matches Step 2

**Report:**
```
Test 3: List Test Tasks
Status: [PASS/FAIL]
Count: [number]
Found Task ID from Step 2: [YES/NO]
Response: [paste JSON response]
```

---

### **STEP 5: Test 4 - System Statistics**

**Endpoint:** `GET http://localhost:3000/v1/test/stats`

**Expected Response:**
```json
{
  "success": true,
  "stats": {
    "tasks": {
      "total": 1,
      "pending": 1,
      "completed": 0,
      "failed": 0
    },
    "agents": {
      "active": 0
    },
    "timestamp": "2025-12-03T..."
  }
}
```

**Validation:**
- ✅ Status code is `200 OK`
- ✅ `success` is `true`
- ✅ Task counts match reality (should have at least 1 pending from Step 2)
- ✅ `timestamp` is present

**Report:**
```
Test 4: System Statistics
Status: [PASS/FAIL]
Pending Tasks: [number]
Response: [paste JSON response]
```

---

### **STEP 6: Test 5 - Save Test Memory**

**Endpoint:** `POST http://localhost:3000/v1/test/memory`

**Request Body:**
```json
{
  "key": "comet_test_" + Date.now(),
  "value": {
    "test": true,
    "message": "Hello from Comet!",
    "timestamp": new Date().toISOString(),
    "agent": "Comet"
  }
}
```

**Headers:**
```
Content-Type: application/json
```

**Expected Response:**
```json
{
  "success": true,
  "memory": {
    "id": "uuid-here",
    "scope": "global",
    "key": "comet_test_...",
    "createdAt": "2025-12-03T..."
  },
  "message": "Test memory saved successfully"
}
```

**Validation:**
- ✅ Status code is `200 OK` or `201 Created`
- ✅ `success` is `true`
- ✅ Memory has valid UUID `id`
- ✅ `key` matches request
- ✅ `scope` is `"global"`

**IMPORTANT:** Save the `key` value for Step 6!

**Report:**
```
Test 5: Save Test Memory
Status: [PASS/FAIL]
Memory Key: [key value]
Response: [paste JSON response]
```

---

### **STEP 7: Test 6 - Retrieve Test Memory**

**Endpoint:** `GET http://localhost:3000/v1/test/memory/{key}`

**Replace `{key}` with the key from Step 5.**

**Example:** `GET http://localhost:3000/v1/test/memory/comet_test_1234567890`

**Expected Response:**
```json
{
  "success": true,
  "memory": {
    "id": "uuid-from-step-5",
    "key": "comet_test_...",
    "value": {
      "test": true,
      "message": "Hello from Comet!",
      "timestamp": "...",
      "agent": "Comet"
    },
    "createdAt": "2025-12-03T..."
  }
}
```

**Validation:**
- ✅ Status code is `200 OK`
- ✅ `success` is `true`
- ✅ `value` matches what was saved in Step 5
- ✅ All fields are present
- ✅ Data persisted correctly

**Report:**
```
Test 6: Retrieve Test Memory
Status: [PASS/FAIL]
Key Used: [key]
Value Matches Step 5: [YES/NO]
Response: [paste JSON response]
```

---

## 📊 **FINAL REPORT FORMAT**

**After completing all 6 tests, provide this summary:**

```
═══════════════════════════════════════════════════════════
COLONY OS TEST RESULTS - COMET VALIDATION
═══════════════════════════════════════════════════════════

Test 1: Health Check
Status: [PASS/FAIL]
Notes: [any issues]

Test 2: Create Test Task
Status: [PASS/FAIL]
Task ID: [uuid]
Notes: [any issues]

Test 3: List Test Tasks
Status: [PASS/FAIL]
Count: [number]
Notes: [any issues]

Test 4: System Statistics
Status: [PASS/FAIL]
Pending Tasks: [number]
Notes: [any issues]

Test 5: Save Test Memory
Status: [PASS/FAIL]
Memory Key: [key]
Notes: [any issues]

Test 6: Retrieve Test Memory
Status: [PASS/FAIL]
Data Persisted: [YES/NO]
Notes: [any issues]

═══════════════════════════════════════════════════════════
SUMMARY
═══════════════════════════════════════════════════════════
Total Tests: 6
Passed: [number]
Failed: [number]
Success Rate: [percentage]%

Overall Status: [PASS/FAIL]
═══════════════════════════════════════════════════════════
```

---

## 🐛 **IF TESTS FAIL**

**For each failure, report:**
1. **Test number and name**
2. **Expected vs. actual response**
3. **HTTP status code**
4. **Error message (if any)**
5. **Screenshot (if helpful)**

**Example:**
```
Test 3: List Test Tasks
Status: FAIL
Expected: 200 OK with tasks array
Actual: 500 Internal Server Error
Error: "Database connection failed"
```

**I'll fix immediately and you can re-test!**

---

## ✅ **SUCCESS CRITERIA**

**All tests PASS when:**
- ✅ All 6 endpoints return `200 OK` or `201 Created`
- ✅ All JSON responses are valid
- ✅ Data persists between requests
- ✅ No errors in browser console
- ✅ Task created in Step 2 appears in Step 3
- ✅ Memory saved in Step 5 retrieves in Step 6

---

## 🚀 **READY TO EXECUTE**

**Comet, you're cleared for testing!**

**Start with:** `http://localhost:3000/v1/test/health`

**Work through all 6 tests in order.**

**Report results back here when complete.**

**Let's prove Colony OS works!** 🐝⚡

---

## 📝 **QUICK REFERENCE**

| Test | Method | Endpoint | Purpose |
|------|--------|----------|---------|
| 1 | GET | `/v1/test/health` | Health check |
| 2 | POST | `/v1/test/task` | Create task |
| 3 | GET | `/v1/test/tasks` | List tasks |
| 4 | GET | `/v1/test/stats` | Statistics |
| 5 | POST | `/v1/test/memory` | Save memory |
| 6 | GET | `/v1/test/memory/:key` | Retrieve memory |

---

**Directive Version:** 1.0  
**Last Updated:** December 3, 2025  
**Status:** READY FOR EXECUTION ✅  
**Priority:** HIGH 🔥

