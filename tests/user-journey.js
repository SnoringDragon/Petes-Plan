/**
 * REALISTIC USER JOURNEY TEST
 * Simulates real Purdue students using the degree planner.
 * Two types of users run in parallel:
 *   - Guest users: just browsing/searching courses
 *   - Logged-in users: login → view degree plan → search courses
 * 
 * Usage: k6 run user-journey.js
 * Save results: k6 run --out json=results/user-journey.json user-journey.js
 * 
 * IMPORTANT: Create a test user in your DB first:
 *   email: test@purdue.edu
 *   password: securePassword
 */

import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const BASE_URL = 'http://PurduePete-1964525879.us-east-1.elb.amazonaws.com';

const loginDuration      = new Trend('login_duration');
const searchDuration     = new Trend('search_duration');
const degreePlanDuration = new Trend('degree_plan_duration');
const authErrorRate      = new Rate('auth_error_rate');

export const options = {
  scenarios: {
    // ── Scenario 1: Guest students browsing courses ──────────────────────────
    guest_students: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 300 },
        { duration: '5m', target: 300 },
        { duration: '2m', target: 1000 },
        { duration: '5m', target: 1000 },
        { duration: '2m', target: 0 },
      ],
      gracefulRampDown: '30s',
      exec: 'guestFlow',
    },

    // ── Scenario 2: Logged-in students viewing their degree plan ─────────────
    logged_in_students: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 300 },
        { duration: '5m', target: 300 },
        { duration: '2m', target: 0 },
      ],
      gracefulRampDown: '30s',
      exec: 'loggedInFlow',
    },
  },

  thresholds: {
    http_req_duration:   ['p(95)<3000'],
    http_req_failed:     ['rate<0.1'],
    login_duration:      ['p(95)<2000'],
    search_duration:     ['p(95)<2000'],
    degree_plan_duration:['p(95)<3000'],
    auth_error_rate:     ['rate<0.05'],
  },
};

// ─── Guest Flow ──────────────────────────────────────────────────────────────
export function guestFlow() {
  const subjects = ['math', 'cs', 'physics', 'english', 'ma', 'ece', 'ie', 'me'];
  const q = subjects[Math.floor(Math.random() * subjects.length)];

  group('Guest - Course Search', () => {
    const res = http.get(`${BASE_URL}/api/courses/search?q=${q}`);
    searchDuration.add(res.timings.duration);
    check(res, {
      'search ok':     (r) => r.status === 200,
      'search fast':   (r) => r.timings.duration < 3000,
    });
    sleep(2);
  });

  group('Guest - Course Scheduling', () => {
    const courses = [
      { subject: 'CS', courseID: '25200' },
      { subject: 'MA', courseID: '26100' },
      { subject: 'ECE', courseID: '20100' },
    ];
    const course = courses[Math.floor(Math.random() * courses.length)];
    const res = http.get(`${BASE_URL}/api/courses/scheduling?subject=${course.subject}&courseID=${course.courseID}`);
    check(res, { 'scheduling ok': (r) => r.status === 200 });
    sleep(1);
  });
}

// ─── Logged-In Flow ──────────────────────────────────────────────────────────
export function loggedInFlow() {
  const headers = { 'Content-Type': 'application/json' };
  let token = null;

  group('Login', () => {
    const res = http.post(
      `${BASE_URL}/api/user/login`,
      JSON.stringify({ email: 'test@purdue.edu', password: 'securePassword', remember: true }),
      { headers }
    );
    loginDuration.add(res.timings.duration);

    const ok = check(res, {
      'login status 200': (r) => r.status === 200,
      'login has token':  (r) => {
        try { return !!JSON.parse(r.body).token; } catch { return false; }
      },
    });
    authErrorRate.add(!ok);

    if (ok) {
      try { token = JSON.parse(res.body).token; } catch {}
    }
    sleep(1);
  });

  if (!token) return; // stop if login failed

  const authHeaders = { ...headers, Authorization: `Bearer ${token}` };

  group('View Degree Plan', () => {
    const res = http.get(`${BASE_URL}/api/degreePlan`, { headers: authHeaders });
    degreePlanDuration.add(res.timings.duration);
    check(res, { 'degree plan ok': (r) => r.status === 200 });
    sleep(2);
  });

  group('Search Courses (logged in)', () => {
    const res = http.get(`${BASE_URL}/api/courses/search?q=cs`, { headers: authHeaders });
    searchDuration.add(res.timings.duration);
    check(res, { 'search ok': (r) => r.status === 200 });
    sleep(1);
  });

  group('Get User Info', () => {
    const res = http.get(`${BASE_URL}/api/user/`, { headers: authHeaders });
    check(res, { 'user info ok': (r) => r.status === 200 });
    sleep(1);
  });
}
