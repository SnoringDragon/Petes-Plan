import { Api } from './Api';
import { UserCourse } from '../types/user-course';
import { DegreePlan } from '../types/degree-plan';
import { makePromiseCache } from '../utils/promise-cache';

class DegreePlanService extends Api {
    getPlans() {
        return this.get<{ degreePlans: DegreePlan[] }>('/api/degreePlan');
    }

    createDegreePlan(name: string) {
        return this.post<{ degreePlan: DegreePlan }>('/api/degreePlan/create', { name });
    }

    addToDegreePlan(plan: string, degrees: { _id: string }[], courses: {
        courseID: string,
        semester: string,
        year: number,
        subject: string,
        section: string,
        overrideStatus?: string
    }[]) {
        return this.post<{ degreePlan: DegreePlan }>(`/api/degreePlan/${plan}/add`, { degrees, courses });
    }

    removeFromDegreePlan(plan: string, degrees: string[], courses: string[]) {
        return this.delete<{ degreePlan: DegreePlan }>(`/api/degreePlan/${plan}/remove`, { degrees, courses });
    }

    getOverlap(plan: string, degree: string ) {
        return this.get<{reqs: {courseID: string, subject: string}[]}>(`/api/degreePlan/${plan}/gradReqsIntersect/${degree}`);
    }

    getTotalReqs(plan: string) {
        return this.get<{reqs: {courseID: string, subject: string}[]}>(`/api/degreePlan/${plan}/gradReqs`);
    }

    getRecommendations(plan: string) {
        return this.get<{recommendations: {_id: string, courseID: string, subject: string}[]}>(`/api/degreePlan/${plan}/courseRecommendations`);
    }

    cachedGetPlans = makePromiseCache(this.getPlans.bind(this));
}

export default new DegreePlanService();
