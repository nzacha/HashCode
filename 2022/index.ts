import fs, { read } from 'fs';
import { momentToString } from './utils/time';
import { Runner } from './Runner';

const inputs = [
    'a_an_example.in.txt',
    'b_better_start_small.in.txt',
    'c_collaboration.in.txt',
    'd_dense_schedule.in.txt',
    'e_exceptional_skills.in.txt',
    'f_find_great_mentors.in.txt'
]

const start = Date.now();
inputs.forEach((val, index) => {
    const data = fs.readFileSync('./input_data/' + val, {encoding:'utf8', flag:'r'});
    const runner = new Runner(index, data);
    
    runner.init();
    runner.run();
    console.log();

    fs.writeFileSync('./results/' + (val.split('.').shift() || '_') + '.txt', runner.doneProjects + '\n' + runner.outputStr);
})

console.log();
console.log(`time taken: ${momentToString(Date.now() - start)}`);