# Colony OS Security Upgrade Path

> **⚠️ DEPLOYMENT NOTE**: Zyeuté now deploys with Vercel; Netlify artifacts and CLI are unsupported.  
> This document is retained for historical reference only.


**Current Status:** MVP with simplified HMAC signatures  
**Target Status:** Production with Ed25519 signatures  
**Priority:** Phase 2.2 Security Hardening

---

## Current Implementation (MVP)

### What We're Using
- **Algorithm:** HMAC-SHA256
- **Location:** `netlify/functions/lib/colony-client.js`
- **Purpose:** Basic request signing for MVP

### Limitations
- Not compatible with Colony OS's native Ed25519 verification
- Less secure than Ed25519
- Doesn't match Colony OS specification

### Why This Is OK for MVP
- Allows rapid development and testing
- Colony Server can be configured to accept HMAC (custom mode)
- Finance Bee uses proper Ed25519 (via pycolonies SDK)
- Only affects Netlify → Colony Server communication

---

## Target Implementation (Production)

### What We Need
- **Algorithm:** Ed25519 cryptographic signatures
- **Library:** `@noble/ed25519` or equivalent
- **Compatibility:** Full Colony OS specification compliance

### Benefits
- Industry-standard cryptographic security
- Compatible with Colony OS native verification
- Zero-Trust architecture fully implemented
- Replay attack protection

---

## Upgrade Steps (Phase 2.2)

### Step 1: Install Ed25519 Library

```bash
cd netlify/functions
npm install @noble/ed25519
```

### Step 2: Implement Signature Functions

Update `netlify/functions/lib/colony-crypto.js`:

```javascript
const ed25519 = require('@noble/ed25519');

async function signPayload(payload, privateKeyHex) {
  const message = Buffer.from(payload, 'utf8');
  const privateKey = Buffer.from(privateKeyHex, 'hex');
  const signature = await ed25519.sign(message, privateKey);
  return Buffer.from(signature).toString('base64');
}

async function verifySignature(payload, signatureBase64, publicKeyHex) {
  const message = Buffer.from(payload, 'utf8');
  const signature = Buffer.from(signatureBase64, 'base64');
  const publicKey = Buffer.from(publicKeyHex, 'hex');
  return await ed25519.verify(signature, message, publicKey);
}
```

### Step 3: Update Colony Client

Replace HMAC in `netlify/functions/lib/colony-client.js`:

```javascript
// Before (HMAC)
const signature = crypto
  .createHmac('sha256', userPrvkey)
  .update(payload + timestamp)
  .digest('hex');

// After (Ed25519)
const { signPayload } = require('./colony-crypto');
const signature = await signPayload(payload + timestamp, userPrvkey);
```

### Step 4: Update Environment Variables

Change from HMAC key to Ed25519 private key:
- `COLONIES_USER_PRVKEY` - Already Ed25519 format from key generation

### Step 5: Test

- Test signature generation
- Test Colony OS accepts signatures
- Test signature replay protection
- Test invalid signature rejection

---

## Testing Strategy

### Unit Tests
```javascript
// test/colony-crypto.test.js
describe('Ed25519 Signatures', () => {
  it('should generate valid signature', async () => {
    const payload = 'test payload';
    const privateKey = '...';
    const signature = await signPayload(payload, privateKey);
    expect(signature).toBeDefined();
  });
  
  it('should verify valid signature', async () => {
    const payload = 'test payload';
    const signature = '...';
    const publicKey = '...';
    const isValid = await verifySignature(payload, signature, publicKey);
    expect(isValid).toBe(true);
  });
});
```

### Integration Tests
- Test Netlify Function → Colony Server with Ed25519
- Test signature rejection for invalid keys
- Test replay attack prevention

---

## Rollback Plan

If Ed25519 upgrade causes issues:

1. **Revert colony-client.js** to HMAC version
2. **Keep Colony Server in HMAC mode**
3. **Debug signature issues offline**
4. **Retry upgrade when fixed**

---

## Timeline

**Phase 2.2 (Week 2):**
- Day 1: Install library and implement functions
- Day 2: Update colony-client.js
- Day 3: Test and validate
- Day 4: Deploy and monitor

**Estimated Time:** 8-10 hours

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Signature incompatibility | High | Test thoroughly before production |
| Library bugs | Medium | Use well-tested library (@noble/ed25519) |
| Key format issues | Medium | Validate key format before use |
| Performance impact | Low | Ed25519 is fast, minimal overhead |

---

## Current Security Posture

**For MVP:**
- ✅ HTTPS/TLS for transport security
- ✅ Webhook signature verification (Stripe)
- ✅ Guardian content validation
- ⚠️ Simplified HMAC for Colony OS (acceptable for MVP)

**For Production:**
- ✅ All MVP security
- ✅ Ed25519 cryptographic signatures
- ✅ Full Zero-Trust architecture
- ✅ Replay attack protection

---

## References

- Colony OS Documentation: https://github.com/colonyos/colonies
- Ed25519 Library: https://github.com/paulmillr/noble-ed25519
- Current Implementation: `netlify/functions/lib/colony-client.js`
- Upgrade Stub: `netlify/functions/lib/colony-crypto.js`

---

**Status:** Documented and ready for Phase 2.2 implementation

