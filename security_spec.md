# Security Specification (TDD SPEC)

## 1. Data Invariants
- **User profiles (`/users/{userId}`)** must only be readable and writeable by the authenticated user matching `userId` (preventing PII leaks of email).
- **Job vacancies (`/jobs/{jobId}`)** are readable by any authenticated user, but can only be created or modified by signed-in users with a verified email.
- **Creator ownership integrity**: The `creatorId` in a new job post must match `request.auth.uid`. A created job post's `creatorId` is immutable.
- **Job updates restrictions**: An employer can only edit jobs they created.
- **Type/Boundaries constraints**: String lengths and list sizes must be strictly capped (e.g. title lengths, maximum sizes for array fields like categories or benefits).

---

## 2. The "Dirty Dozen" Malicious Payloads
The security rules are constructed to block the following 12 insecure write/update payloads:

### Payload 1: PII Leak - Read other user's profile
- **Path**: `GET /users/victim123`
- **Attacker UID**: `attacker456`
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 2: Profile Hijack - Create/update profile under another user's UID
- **Path**: `CREATE /users/victim123`
- **Attacker UID**: `attacker456`
- **Payload**: `{ "uid": "victim123", "email": "victim@example.com", "displayName": "Victim", "role": "candidate", "createdAt": "2026-06-05T01:46:41Z" }`
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 3: Injecting Non-Id Characters into User ID
- **Path**: `CREATE /users/user-with-junk-$$%-chars`
- **Attacker UID**: `attacker456`
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 4: Invalid Role Injection in Profile
- **Path**: `CREATE /users/attacker456`
- **Attacker UID**: `attacker456`
- **Payload**: `{ "uid": "attacker456", "email": "attacker@gmail.com", "displayName": "Attacker", "role": "super_admin", "createdAt": "2026-06-05T01:46:41Z" }`
- **Expected Outcome**: `PERMISSION_DENIED` (role must be strictly 'candidate' or 'employer')

### Payload 5: Email Spoofing Attack (Unverified Email Write)
- **Path**: `CREATE /jobs/job123`
- **Attacker UID**: `attacker456` (email_verified: false)
- **Payload**: `{ "title": "Insecure Frontend Developer", "companyName": "Insecure Corp", "industry": "Technology", "location": "Phnom Penh", "type": "Full-time", "salary": "$1500", "experience": "Junior", "description": "Fake vacancy", "postedAt": "2450-01-01", "creatorId": "attacker456" }`
- **Expected Outcome**: `PERMISSION_DENIED` (requires email_verified: true)

### Payload 6: Ownership Impersonation - Posting a job under another user's creatorId
- **Path**: `CREATE /jobs/job123`
- **Attacker UID**: `attacker456` (email_verified: true)
- **Payload**: `{ "title": "Frontend dev", "companyName": "Co", "industry": "Tech", "location": "Remote", "type": "Full-time", "salary": "$500", "experience": "1-2y", "description": "Valid desc", "postedAt": "2026-06-05T01:46:41Z", "creatorId": "victim123" }`
- **Expected Outcome**: `PERMISSION_DENIED` (creatorId must match request.auth.uid)

### Payload 7: Denial of Wallet - Uncapped array size in Job Requirements
- **Path**: `CREATE /jobs/job123`
- **Attacker UID**: `attacker456` (email_verified: true)
- **Payload**: Contains a requirements array of 10,000 strings to cause DB bloating.
- **Expected Outcome**: `PERMISSION_DENIED` (`requirements.size() <= 20` enforcement)

### Payload 8: Immutable field hacking - Modifying `creatorId` on an existing job
- **Path**: `UPDATE /jobs/existingJob`
- **Attacker UID**: `creator_user` (email_verified: true)
- **Payload**: Attempting to change `creatorId` from `creator_user` to `victim123`.
- **Expected Outcome**: `PERMISSION_DENIED` (creatorId is immutable)

### Payload 9: Hijack job - Employee modifying job details of another employer
- **Path**: `UPDATE /jobs/victimJob`
- **Attacker UID**: `attacker456` (email_verified: true)
- **Payload**: Change vacancy details of a job created by `victim123`.
- **Expected Outcome**: `PERMISSION_DENIED` (only creator of jobs can update them)

### Payload 10: Value Poisoning - Injecting non-string elements into arrays
- **Path**: `CREATE /jobs/job123`
- **Attacker UID**: `attacker456` (email_verified: true)
- **Payload**: `{ "title": "Developer", ..., "requirements": [1, 2, true, { "fake": "object" }] }`
- **Expected Outcome**: `PERMISSION_DENIED` (requires requirements[0] is string)

### Payload 11: Shadow Fields / Ghost Fields Update
- **Path**: `UPDATE /jobs/job123`
- **Attacker UID**: `attacker456` (email_verified: true)
- **Payload**: Updating jobs with an un-whitelisted schema field `{ "isPremiumSponsored": true }`.
- **Expected Outcome**: `PERMISSION_DENIED` (affectedKeys().hasOnly() blocks this)

### Payload 12: Timestamp Spoofing inside Create Profile
- **Path**: `CREATE /users/attacker456`
- **Attacker UID**: `attacker456`
- **Payload**: `{ "uid": "attacker456", "email": "attacker@gmail.com", "displayName": "Attacker", "role": "candidate", "createdAt": "2500-01-01" }`
- **Expected Outcome**: `PERMISSION_DENIED` (createdAt must match request.time)

---

## 3. Test Runner Design
Below is the virtual test implementation mapped directly to target assertions within `firestore.rules`.
