/**
 * PETES PLAN — Comprehensive Stress Test
 * Based on actual API routes from the Postman collection.
 *
 * Three user types run simultaneously:
 *   - Guest:      browse courses & scheduling (no login needed)
 *   - Student:    login → view/manage degree plan → course history
 *   - Power user: login → grad requirements → course recommendations
 *
 * Usage:
 *   Single user baseline:   k6 run --vus 1 --duration 30s stress-test.js
 *   Ramp test:              k6 run stress-test.js
 *   Save results:           k6 run --out json=results/baseline.json stress-test.js
 *
 * BEFORE RUNNING:
 *   Create a test user in MongoDB Atlas:
 *     email:    test@purdue.edu
 *     password: securePassword
 *   Then create a degree plan for that user and note its _id.
 *   Set DEGREE_PLAN_ID below.
 */

import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// ── Config ────────────────────────────────────────────────────────────────────
const BASE_URL        = 'http://PurduePete-1964525879.us-east-1.elb.amazonaws.com';
const TEST_EMAIL      = 'lin1433@purdue.edu';
const TEST_PASSWORD   = 'password';
const DEGREE_PLAN_ID  = '69d6f868b7cf654384368d56'; // from MongoDB Atlas

// ── Custom metrics ────────────────────────────────────────────────────────────
const loginDuration          = new Trend('duration_login');
const courseSearchDuration   = new Trend('duration_course_search');
const schedulingDuration     = new Trend('duration_scheduling');
const boilergradesDuration   = new Trend('duration_boilergrades');
const degreePlanDuration     = new Trend('duration_degree_plan');
const gradReqsDuration       = new Trend('duration_grad_reqs');
const courseHistoryDuration  = new Trend('duration_course_history');
const errorRate              = new Rate('error_rate');
const totalRequests          = new Counter('total_requests');

// ── Test stages ───────────────────────────────────────────────────────────────
export const options = {
  scenarios: {
    // Guests: just browsing, no auth needed — highest volume
    guest_users: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },
        { duration: '3m', target: 50 },
        { duration: '1m', target: 200 },
        { duration: '3m', target: 200 },
        { duration: '1m', target: 500 },
        { duration: '3m', target: 500 },
        { duration: '2m', target: 0 },
      ],
      exec: 'guestFlow',
      gracefulRampDown: '30s',
    },

    // Logged-in students managing their degree plans — medium volume
    student_users: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 20 },
        { duration: '3m', target: 20 },
        { duration: '1m', target: 100 },
        { duration: '3m', target: 100 },
        { duration: '1m', target: 200 },
        { duration: '3m', target: 200 },
        { duration: '2m', target: 0 },
      ],
      exec: 'studentFlow',
      gracefulRampDown: '30s',
    },
  },

  thresholds: {
    // Overall
    http_req_duration:         ['p(95)<3000'],
    http_req_failed:           ['rate<0.1'],
    error_rate:                ['rate<0.1'],
    // Per endpoint
    duration_login:            ['p(95)<2000'],
    duration_course_search:    ['p(95)<2000'],
    duration_scheduling:       ['p(95)<2000'],
    duration_boilergrades:     ['p(95)<3000'],
    duration_degree_plan:      ['p(95)<2000'],
    duration_grad_reqs:        ['p(95)<3000'],
    duration_course_history:   ['p(95)<2000'],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const JSON_HEADERS = { 'Content-Type': 'application/json' };

function login() {
  const res = http.post(
    `${BASE_URL}/api/user/login`,
    JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD, remember: true }),
    { headers: JSON_HEADERS }
  );
  loginDuration.add(res.timings.duration);
  totalRequests.add(1);

  const ok = check(res, {
    'login 200':     (r) => r.status === 200,
    'login has token': (r) => {
      try { return !!JSON.parse(r.body).token; } catch { return false; }
    },
  });
  errorRate.add(!ok);

  if (!ok) return null;
  try { return JSON.parse(res.body).token; } catch { return null; }
}

// ── Guest Flow (no auth) ──────────────────────────────────────────────────────
export function guestFlow() {
  const subjects   = ['cs', 'math', 'ece', 'ma', 'ie', 'me', 'phys', 'engl', 'mgmt', 'stat'];
  const csSubjects = ['CS', 'MA', 'ECE', 'IE', 'ME'];
  const courseIDs  = ['25200', '18200', '30700', '26100', '20001'];

  group('Course Search', () => {
    const q   = subjects[Math.floor(Math.random() * subjects.length)];
    const res = http.get(`${BASE_URL}/api/courses/search?q=${q}`);
    courseSearchDuration.add(res.timings.duration);
    totalRequests.add(1);
    const ok = check(res, {
      'search 200':         (r) => r.status === 200,
      'search has results': (r) => {
        try { return Array.isArray(JSON.parse(r.body)); } catch { return false; }
      },
    });
    errorRate.add(!ok);
    sleep(1);
  });

  group('Course Scheduling', () => {
    const subject  = csSubjects[Math.floor(Math.random() * csSubjects.length)];
    const courseID = courseIDs[Math.floor(Math.random() * courseIDs.length)];
    const res      = http.get(`${BASE_URL}/api/courses/scheduling?subject=${subject}&courseID=${courseID}`);
    schedulingDuration.add(res.timings.duration);
    totalRequests.add(1);
    check(res, { 'scheduling 200 or 404': (r) => r.status === 200 || r.status === 404 });
    sleep(1);
  });

  group('Boilergrades', () => {
    const courses = [
      { subject: 'AMST', courseID: '10100' },
      { subject: 'CS',   courseID: '25200' },
      { subject: 'MA',   courseID: '26100' },
    ];
    const course = courses[Math.floor(Math.random() * courses.length)];
    const res    = http.get(`${BASE_URL}/api/boilergrades/course?courseID=${course.courseID}&subject=${course.subject}`);
    boilergradesDuration.add(res.timings.duration);
    totalRequests.add(1);
    check(res, { 'boilergrades 200': (r) => r.status === 200 });
    sleep(1);
  });
}

// ── Student Flow (authenticated) ──────────────────────────────────────────────
export function studentFlow() {
  // Step 1: Login
  const token = login();
  if (!token) { sleep(2); return; }

  const authHeaders = {
    ...JSON_HEADERS,
    'Authorization': `Bearer ${token}`,
  };

  sleep(1);

  // Step 2: Get user info
  group('Get User Info', () => {
    const res = http.get(`${BASE_URL}/api/user/`, { headers: authHeaders });
    totalRequests.add(1);
    check(res, { 'user info 200': (r) => r.status === 200 });
    sleep(1);
  });

  // Step 3: Get all degree plans
  group('Get Degree Plans', () => {
    const res = http.get(`${BASE_URL}/api/degreePlan/`, { headers: authHeaders });
    degreePlanDuration.add(res.timings.duration);
    totalRequests.add(1);
    check(res, { 'degree plans 200': (r) => r.status === 200 });
    sleep(1);
  });

  // Step 4: Get specific degree plan
  group('Get Degree Plan Detail', () => {
    const res = http.get(`${BASE_URL}/api/degreePlan/${DEGREE_PLAN_ID}`, { headers: authHeaders });
    degreePlanDuration.add(res.timings.duration);
    totalRequests.add(1);
    check(res, { 'degree plan detail 200': (r) => r.status === 200 || r.status === 404 });
    sleep(1);
  });

  // Step 5: Get graduation requirements
  group('Grad Requirements', () => {
    const res = http.get(`${BASE_URL}/api/degreePlan/${DEGREE_PLAN_ID}/gradReqs`, { headers: authHeaders });
    gradReqsDuration.add(res.timings.duration);
    totalRequests.add(1);
    check(res, { 'grad reqs 200': (r) => r.status === 200 || r.status === 404 });
    sleep(1);
  });

  // Step 6: Get course history
  group('Course History', () => {
    const res = http.get(`${BASE_URL}/api/coursehistory/`, { headers: authHeaders });
    courseHistoryDuration.add(res.timings.duration);
    totalRequests.add(1);
    check(res, { 'course history 200': (r) => r.status === 200 });
    sleep(1);
  });

  // Step 7: Search for a course (authenticated)
  group('Course Search (authenticated)', () => {
    const queries = ['cs', 'math', 'ece'];
    const q       = queries[Math.floor(Math.random() * queries.length)];
    const res     = http.get(`${BASE_URL}/api/courses/search?q=${q}`, { headers: authHeaders });
    courseSearchDuration.add(res.timings.duration);
    totalRequests.add(1);
    check(res, { 'auth search 200': (r) => r.status === 200 });
    sleep(1);
  });

  sleep(2);
}