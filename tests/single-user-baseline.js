/**
 * SINGLE USER BASELINE
 * Run this FIRST with 1 virtual user to measure raw endpoint latency.
 * These numbers become your baseline — the "best case" latency.
 * 
 * Usage: k6 run single-user-baseline.js
 * 
 * Results to record for your report:
 *   - duration_course_search   p(95)
 *   - duration_scheduling      p(95)
 *   - duration_boilergrades    p(95)
 *   - duration_degree_plan     p(95)
 *   - duration_grad_reqs       p(95)
 *   - duration_course_history  p(95)
 */

import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { Trend } from 'k6/metrics';

const BASE_URL      = 'http://PurduePete-1964525879.us-east-1.elb.amazonaws.com';
const TEST_EMAIL    = 'lin1433@purdue.edu';
const TEST_PASSWORD = 'password';
const DEGREE_PLAN_ID = '69d6f868b7cf654384368d56';

const courseSearchDuration  = new Trend('duration_course_search');
const schedulingDuration    = new Trend('duration_scheduling');
const boilergradesDuration  = new Trend('duration_boilergrades');
const degreePlanDuration    = new Trend('duration_degree_plan');
const gradReqsDuration      = new Trend('duration_grad_reqs');
const courseHistoryDuration = new Trend('duration_course_history');
const loginDuration         = new Trend('duration_login');

export const options = {
  vus:      1,         // single user
  duration: '2m',      // run long enough for stable averages
};

export default function () {
  const JSON_HEADERS = { 'Content-Type': 'application/json' };

  // ── Unauthenticated endpoints ──────────────────────────────────────────────

  group('Course Search', () => {
    const res = http.get(`${BASE_URL}/api/courses/search?q=cs`);
    courseSearchDuration.add(res.timings.duration);
    check(res, { 'search 200': (r) => r.status === 200 });
    console.log(`Course Search: ${res.timings.duration}ms`);
    sleep(1);
  });

  group('Course Scheduling', () => {
    const res = http.get(`${BASE_URL}/api/courses/scheduling?subject=CS&courseID=25200`);
    schedulingDuration.add(res.timings.duration);
    check(res, { 'scheduling 200': (r) => r.status === 200 });
    console.log(`Scheduling: ${res.timings.duration}ms`);
    sleep(1);
  });

  group('Boilergrades', () => {
    const res = http.get(`${BASE_URL}/api/boilergrades/course?courseID=25200&subject=CS`);
    boilergradesDuration.add(res.timings.duration);
    check(res, { 'boilergrades 200': (r) => r.status === 200 });
    console.log(`Boilergrades: ${res.timings.duration}ms`);
    sleep(1);
  });

  // ── Authenticated endpoints ────────────────────────────────────────────────

  const loginRes = http.post(
    `${BASE_URL}/api/user/login`,
    JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD, remember: true }),
    { headers: JSON_HEADERS }
  );
  loginDuration.add(loginRes.timings.duration);
  console.log(`Login: ${loginRes.timings.duration}ms`);

  let token = null;
  try { token = JSON.parse(loginRes.body).token; } catch {}
  if (!token) { sleep(2); return; }

  const authHeaders = { ...JSON_HEADERS, Authorization: `Bearer ${token}` };

  group('Degree Plan', () => {
    const res = http.get(`${BASE_URL}/api/degreePlan/`, { headers: authHeaders });
    degreePlanDuration.add(res.timings.duration);
    check(res, { 'degree plan 200': (r) => r.status === 200 });
    console.log(`Degree Plan: ${res.timings.duration}ms`);
    sleep(1);
  });

  group('Grad Requirements', () => {
    const res = http.get(`${BASE_URL}/api/degreePlan/${DEGREE_PLAN_ID}/gradReqs`, { headers: authHeaders });
    gradReqsDuration.add(res.timings.duration);
    check(res, { 'grad reqs 200 or 404': (r) => r.status === 200 || r.status === 404 });
    console.log(`Grad Reqs: ${res.timings.duration}ms`);
    sleep(1);
  });

  group('Course History', () => {
    const res = http.get(`${BASE_URL}/api/coursehistory/`, { headers: authHeaders });
    courseHistoryDuration.add(res.timings.duration);
    check(res, { 'course history 200': (r) => r.status === 200 });
    console.log(`Course History: ${res.timings.duration}ms`);
    sleep(1);
  });

  sleep(2);
}