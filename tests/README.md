# Stress Tests — Purdue Degree Planner

## Prerequisites

### 1. Install k6
```bash
# Windows (requires Chocolatey)
choco install k6

# Mac
brew install k6

# Linux
sudo apt install k6
```

### 2. Create a Test User
Before running authenticated tests, create a test user in your database:
```
email: test@purdue.edu
password: securePassword
```

---

## Test Scripts

| Script | Purpose | When to Run |
|---|---|---|
| `baseline.js` | Raw performance, no cache | FIRST — establish baseline |
| `user-journey.js` | Realistic student behavior | Main benchmarking test |
| `spike.js` | Registration day simulation | Test autoscaling |
| `cache-comparison.js` | Cache hit vs miss comparison | AFTER Redis is set up |

---

## Running Tests

```bash
# Basic run (prints to terminal)
k6 run stress-tests/baseline.js

# Save results to JSON for comparison
k6 run --out json=results/baseline.json stress-tests/baseline.js
k6 run --out json=results/with-redis.json stress-tests/baseline.js
k6 run --out json=results/with-autoscaling.json stress-tests/spike.js
```

---

## Benchmarking Plan (4 Scenarios for Report)

Run each scenario and save results separately:

```bash
# Scenario 1: No Redis, No Autoscaling (baseline)
k6 run --out json=results/s1_baseline.json stress-tests/baseline.js

# Scenario 2: No Redis, With Autoscaling
# (enable autoscaling in ECS first, then run)
k6 run --out json=results/s2_autoscaling.json stress-tests/spike.js

# Scenario 3: Redis, No Autoscaling
# (set up Redis + update REDIS_URL env var in ECS, disable autoscaling)
k6 run --out json=results/s3_redis.json stress-tests/cache-comparison.js

# Scenario 4: Redis + Autoscaling (best case)
k6 run --out json=results/s4_redis_autoscaling.json stress-tests/user-journey.js
```

---

## Key Metrics to Report

| Metric | Description |
|---|---|
| `http_req_duration p(50)` | Median response time |
| `http_req_duration p(95)` | 95th percentile response time |
| `http_req_duration p(99)` | 99th percentile response time |
| `http_req_failed rate` | % of failed requests |
| `http_reqs rate` | Requests per second |
| `first_request_duration` | Cache miss latency |
| `repeated_request_duration` | Cache hit latency |

---

## Expected Results

```
Scenario 1 (baseline):          ~150-200ms p95
Scenario 2 (autoscaling):       ~100-150ms p95 (more capacity)
Scenario 3 (redis):             ~10-30ms p95 for cached endpoints
Scenario 4 (redis+autoscaling): ~10-30ms p95 + handles more users
```
