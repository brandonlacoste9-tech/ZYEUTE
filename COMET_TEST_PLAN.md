# 🧪 Comet Test Plan - Colony OS Validation

**Date:** December 3, 2025  
**Tester:** Comet (Perplexity Browser Automation)  
**Target:** Colony OS Kernel API  
**Status:** Ready for Execution  

---

## 🎯 **MISSION: Validate Colony OS End-to-End**

Comet, you're going to test the Colony OS Kernel API to ensure everything works correctly. I've created special test endpoints just for you!

---

## 📋 **TEST SUITE**

### **Test 1: Health Check** ✅

**Endpoint:** `GET http://localhost:3000/v1/test/health`

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

**Validation:**
- ✅ Status is "healthy"
- ✅ Timestamp is valid ISO format
- ✅ Kernel is "online"

**Action:** Navigate to `http://localhost:3000/v1/test/health` and verify response.

---

### **Test 2: Create Test Task** ✅

**Endpoint:** `POST http://localhost:3000/v1/test/task`

**Request Body:**
```json
{
  "description": "Test task from Comet - " + timestamp,
  "priority": "high"
}
```

**Expected Response:**
```json
{
  "success": true,
  "task": {
    "id": "uuid",
    "type": "test",
    "status": "pending",
    "priority": "high",
    "createdAt": "2025-12-03T..."
  },
  "message": "Test task created successfully"
}
```

**Validation:**
- ✅ `success` is `true`
- ✅ Task has valid UUID `id`
- ✅ Status is `"pending"`
- ✅ Priority matches request
- ✅ CreatedAt is valid timestamp

**Action:** Submit POST request and verify response.

---

### **Test 3: List Test Tasks** ✅

**Endpoint:** `GET http://localhost:3000/v1/test/tasks`

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "tasks": [
    {
      "id": "uuid",
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
- ✅ `success` is `true`
- ✅ `count` matches number of test tasks
- ✅ Task from Test 2 appears in list
- ✅ Tasks are sorted by createdAt (newest first)

**Action:** Navigate to endpoint and verify your test task appears.

---

### **Test 4: System Statistics** ✅

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
- ✅ `success` is `true`
- ✅ Task counts match reality
- ✅ Timestamp is valid

**Action:** Navigate to endpoint and verify stats match Test 2 & 3.

---

### **Test 5: Save Test Memory** ✅

**Endpoint:** `POST http://localhost:3000/v1/test/memory`

**Request Body:**
```json
{
  "key": "comet_test_" + timestamp,
  "value": {
    "test": true,
    "message": "Hello from Comet!",
    "timestamp": "2025-12-03T..."
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "memory": {
    "id": "uuid",
    "scope": "global",
    "key": "comet_test_...",
    "createdAt": "2025-12-03T..."
  },
  "message": "Test memory saved successfully"
}
```

**Validation:**
- ✅ `success` is `true`
- ✅ Memory has valid UUID `id`
- ✅ Key matches request
- ✅ Scope is `"global"`

**Action:** Submit POST request and save the `key` for Test 6.

---

### **Test 6: Retrieve Test Memory** ✅

**Endpoint:** `GET http://localhost:3000/v1/test/memory/{key}`

**Replace `{key}` with the key from Test 5.**

**Expected Response:**
```json
{
  "success": true,
  "memory": {
    "id": "uuid",
    "key": "comet_test_...",
    "value": {
      "test": true,
      "message": "Hello from Comet!",
      "timestamp": "2025-12-03T..."
    },
    "createdAt": "2025-12-03T..."
  }
}
```

**Validation:**
- ✅ `success` is `true`
- ✅ Value matches what was saved in Test 5
- ✅ All fields are present

**Action:** Navigate to endpoint with your saved key and verify data persistence.

---

## 🎯 **EXECUTION INSTRUCTIONS FOR COMET**

### **Step 1: Start Colony OS**

**If not already running:**
```bash
cd C:\Users\north\.cursor\extensions\Zyeute-app
docker-compose -f colony-os-hybrid-stack.yml up -d
```

**Wait for services to be healthy:**
```bash
# Check health
curl http://localhost:3000/v1/test/health
```

---

### **Step 2: Execute Test Suite**

**Run tests in order (Test 1 → Test 6):**

1. **Test 1:** Navigate to `http://localhost:3000/v1/test/health`
2. **Test 2:** POST to `http://localhost:3000/v1/test/task` with JSON body
3. **Test 3:** Navigate to `http://localhost:3000/v1/test/tasks`
4. **Test 4:** Navigate to `http://localhost:3000/v1/test/stats`
5. **Test 5:** POST to `http://localhost:3000/v1/test/memory` with JSON body
6. **Test 6:** Navigate to `http://localhost:3000/v1/test/memory/{key}`

---

### **Step 3: Document Results**

**For each test, report:**
- ✅ **PASS** or ❌ **FAIL**
- Actual response received
- Any errors or unexpected behavior
- Screenshots (if helpful)

---

## 🔍 **WHAT TO LOOK FOR**

### **Success Indicators:**
- ✅ All endpoints return `200 OK`
- ✅ JSON responses are valid
- ✅ UUIDs are properly formatted
- ✅ Timestamps are ISO 8601
- ✅ Data persists between requests
- ✅ No console errors

### **Failure Indicators:**
- ❌ `500 Internal Server Error`
- ❌ `404 Not Found`
- ❌ Invalid JSON responses
- ❌ Missing required fields
- ❌ Data not persisting
- ❌ Database connection errors

---

## 📊 **EXPECTED RESULTS**

**All 6 tests should PASS:**

```
✅ Test 1: Health Check          → PASS
✅ Test 2: Create Test Task      → PASS
✅ Test 3: List Test Tasks       → PASS
✅ Test 4: System Statistics     → PASS
✅ Test 5: Save Test Memory      → PASS
✅ Test 6: Retrieve Test Memory  → PASS

Total: 6/6 PASSED ✅
```

---

## 🐛 **IF TESTS FAIL**

**Report failures to Cursor (me) with:**
1. Test number and name
2. Expected vs. actual response
3. Error message (if any)
4. Screenshot (if helpful)

**I'll fix immediately and you can re-test!**

---

## 🎉 **SUCCESS CRITERIA**

**Colony OS is validated when:**
- ✅ All 6 tests pass
- ✅ No errors in logs
- ✅ Data persists correctly
- ✅ API responses are correct

---

## 🚀 **READY TO START?**

**Comet, you're cleared for testing!**

**Start with Test 1 and work through all 6 tests.**

**Report results back here and I'll fix any issues immediately.**

**Let's prove Colony OS works!** 🐝⚡

---

**Test Plan Version:** 1.0  
**Last Updated:** December 3, 2025  
**Status:** Ready for Execution ✅
