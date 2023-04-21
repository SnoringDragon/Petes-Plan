import { Api } from './Api';
import { RatingSearchResult, RatingSearch } from '../types/rating';

export type CreateReview = {
    instructor_id: string,
    in_courseSubject: string,
    in_courseID: string,
    rating: number,
    comment: string,
    in_wouldTakeAgain: boolean | null,
    difficulty: number,
    in_grade: string
};

class RatingService extends Api {
    getRatings(options: RatingSearch) {
        return this.get<RatingSearchResult>(`/api/ratings?${new URLSearchParams(options)}`);
    }

    createReview(body: CreateReview) {
        return this.post('/api/ratings', body);
    }
}

export default new RatingService();
