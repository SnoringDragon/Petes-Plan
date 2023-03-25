const { request, gql } = require('graphql-request');

const TeacherSearchQuery = gql`query TeacherSearchPaginationQuery(
  $count: Int!
  $cursor: String
  $query: TeacherSearchQuery!
) {
  search: newSearch {
    teachers(query: $query, first: $count, after: $cursor) {
      didFallback
      edges {
        cursor
        node {
          legacyId
          firstName
          lastName
          department
          ratings(first: 10000) {
            edges {
              node {
                grade
                date
                id
                ratingTags
                comment
                attendanceMandatory
                difficultyRatingRounded
                helpfulRatingRounded
                class
                isForCredit
                isForOnlineClass
                textbookIsUsed
                iWouldTakeAgain
              }
            }
          }
          __typename
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      resultCount
    }
  }
}
`;

class RateMyProfessor {
    async _request(document, variables) {
        return request('https://www.ratemyprofessors.com/graphql', document, variables, {
            authorization: 'Basic dGVzdDp0ZXN0'
        });
    }

    /**
     * Get ratings
     *
     * @param schoolID
     * @param count
     * @param text
     * @typedef {{
     *     id: string,
     *     difficultyRatingRounded: number,
     *     helpfulRatingRounded: number,
     *     attendanceMandatory: string,
     *     class: string,
     *     comment: string,
     *     date: string,
     *     grade: string,
     *     iWouldTakeAgain: string | null,
     *     isForCredit: boolean,
     *     isForOnlineClass: boolean,
     *     ratingTags: string,
     *     textbookIsUsed: boolean
     * }} Rating
     * @typedef {{
     *     id: string,
     *     firstName: string,
     *     lastName: string,
     *     ratings: {
     *         edges: {
     *             node: Rating
     *         }[]
     *     }
     * }} Teacher
     * @returns {Promise<{
     *     search: {
     *         teachers: {
     *             didFallback: boolean,
     *             edges: {
     *                 cursor: string,
     *                 node: Teacher
     *             }[]
     *         }
     *     }
     * }>}
     */
    getRatings({ schoolID = 'U2Nob29sLTc4Mw==', count = 10000, text = '*' } = {}) {
        return this._request(TeacherSearchQuery, {
            count,
            query: {
                text,
                schoolID,
                fallback: false
            }
        });
    }
}

module.exports = new RateMyProfessor();
module.exports.RateMyProfessor = RateMyProfessor;