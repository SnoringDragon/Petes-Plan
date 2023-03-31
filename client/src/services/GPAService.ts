import { Api } from './Api';

class GPAService extends Api {
    getCumulativeGPA() {
        return this.get<number | null>('/api/GPA/cumulativeGPA')
    }

    getSemesterGPA(options: { semesterInput: string, yearInput: number }) {
        return this.get<number | null>(`/api/GPA/semesterGPA?semesterInput=${
            encodeURIComponent(options.semesterInput)
        }&yearInput=${options.yearInput}`);
    }

    getMajorGPA(options: { major?: string } = {}) {
        return this.get<number | null>(`/api/GPA/majorGPA${options.major ? '?major=' + options.major : ''}`);
    }
}

export default new GPAService();
