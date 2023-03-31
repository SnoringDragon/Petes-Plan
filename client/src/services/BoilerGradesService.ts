import { Api } from './Api';
import { Boilergrade, BOILERGRADE_QUALITY_POINTS, BOILERGRADES_GRADES } from '../types/boilergrades';

export type Grades = Partial<{ [key in keyof typeof BOILERGRADES_GRADES]: number } >

class BoilerGradesService extends Api {
    getCourse(options: { courseID: string, subject: string }) {
        return this.get(`/api/boilergrades/course?${new URLSearchParams(options)}`);
    }

    getInstructor(options: {first: string, last: string}) {
        return this.get(`/api/boilergrades/instructor?${new URLSearchParams(options)}`)
    }

    calcAvgGpa(grades: Boilergrade[]) {
        const averagePoints: { [key in keyof typeof BOILERGRADE_QUALITY_POINTS]?: number } = {};
        let total = 0;

        grades.forEach(grade => {
            Object.entries(BOILERGRADE_QUALITY_POINTS).forEach(([key, val]) => {
                if ((grade as any)[key] === null) return;
                if (!(key in averagePoints)) (averagePoints as any)[key] = 0;
                const num = parseFloat((grade as any)[key]);
                (averagePoints as any)[key] += num;
                total += num;
            })
        });

        return Object.entries(averagePoints)
            .reduce((acc, [key, val]) => acc + val / total * (BOILERGRADE_QUALITY_POINTS as any)[key], 0)
    }

    reduceBoilergrades(grades: Boilergrade[], by: 'instructor' | 'course'):
        { data: Map<string, { gpa: number, diff: number, grades: Grades }>, overall: { grades: Grades, gpa: number } } {

        const overallAverage = this.calcAvgGpa(grades);

        const totalMap = grades.reduce((dict, val) => {
            Object.entries(val).forEach(([key, val]) => {
                if (!(key in BOILERGRADES_GRADES)) return;
                if (val === null) return;
                if (!(key in dict)) dict[key] = 0;
                dict[key] += parseFloat(val as string);
            })

            return dict;
        }, {} as any);

        Object.keys(totalMap).forEach(k => totalMap[k] /= grades.length)


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


        return { data: new Map([...bgmap].map(([key, values]) => {
            const average = this.calcAvgGpa(values);

            const specificMap = values.reduce((dict, val) => {
                Object.entries(val).forEach(([key, val]) => {
                    if (!(key in BOILERGRADES_GRADES)) return;
                    if (val === null) return;
                    if (!(key in dict)) dict[key] = 0;
                    dict[key] += parseFloat(val as string);
                })

                return dict;
            }, {} as any);

            Object.keys(specificMap).forEach(k => specificMap[k] /= values.length);

            return [key, { grades: specificMap, gpa: average, diff: average - overallAverage }];
        })), overall: { grades: totalMap, gpa: overallAverage } };
    }
}

export default new BoilerGradesService();
