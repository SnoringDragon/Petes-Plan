import { Api } from './Api';
import { RatingSearchResult, RatingSearch } from '../types/rating';

class RatingService extends Api {
    getRatings(options: RatingSearch) {
        return this.get<RatingSearchResult>(`/api/ratings?${new URLSearchParams(options)}`);
    }
}

export default new RatingService();
