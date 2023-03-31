import { Api } from './Api';
import { Boilergrade, BOILERGRADES_GRADES } from '../types/boilergrades';

class BoilerGradesService extends Api {
    getCourse(options: { courseID: string, subject: string }) {
        return this.get(`/api/boilergrades/course?${new URLSearchParams(options)}`);
    }

    getInstructor(options: {first: string, last: string}) {
        return this.get(`/api/boilergrades/instructor?${new URLSearchParams(options)}`)
    }

    reduceBoilergrades(grades: Boilergrade[], by: 'instructor' | 'course'):
        Map<string, Partial<{ [key in keyof typeof BOILERGRADES_GRADES]: number }> > {
        const bgmap = grades.reduce((dict, bg) => {
            let data = '';
            if (by === 'instructor')
                data = bg.instructor
            else
                data = `${bg.subject} ${bg.course_num}`;

            if (!dict.has(data)) dict.set(data, []);

            dict.get(data)!.push(bg);

            return dict;
        }, new Map<string, Boilergrade[]>());

        return new Map([...bgmap].map(([key, values]) => {
            const totalMap = values.reduce((dict, val) => {
                Object.entries(val).forEach(([key, val]) => {
                    if (!(key in BOILERGRADES_GRADES)) return;
                    if (val === null) return;
                    if (!(key in dict)) dict[key] = 0;
                    dict[key] += parseFloat(val as string);
                })

                return dict;
            }, {} as any);

            Object.keys(totalMap).forEach(k => totalMap[k] /= values.length);

            return [key, totalMap];
        }));
    }
}

export default new BoilerGradesService();
