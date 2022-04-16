import {User, Project, Skill} from './models';

export class Runner{
    inputIndex: number;
    data: string;
    lines: string[];
    lineIndex: number;

    numUsers: number;
    numProjects: number;

    users: Map<string, User> = new Map();
    usersArr: User[] = [];
    projects: Map<string, Project> = new Map();
    projectsArr: Project[] = [];

    constructor(inputIndex: number, data: string){
        this.inputIndex = inputIndex;
        this.data = data;
        this.lines = data.split('\n');
        this.numUsers = parseInt(this.lines[0].split(' ')[0]);
        this.numProjects = parseInt(this.lines[0].split(' ')[1]);
        
        this.lineIndex = 1;
        this.readUsers();
        this.readProjects();
    }

    private readUsers(){
        while(this.users.size < this.numUsers){
            let line = this.lines[this.lineIndex++];
            const userName = line.split(' ')[0];
            const numSkills = parseInt(line.split(' ')[1]);
            
            const skills: Map<string, Skill> = new Map();
            for(let skillIndex=0; skillIndex<numSkills; skillIndex++){
                line = this.lines[this.lineIndex++];
                const skillName = line.split(' ')[0];
                const skillLevel = parseInt(line.split(' ')[1]);
                skills.set(skillName, new Skill(skillName, skillLevel));
            }

            const user = new User(userName, skills);
            this.users.set(userName, user);
            this.usersArr.push(user);
        }
    }

    private readProjects(){
        while(this.projects.size < this.numProjects){
            let line = this.lines[this.lineIndex++];
            const projectName = line.split(' ')[0];
            const duration = parseInt(line.split(' ')[1]);
            const score = parseInt(line.split(' ')[2]);
            const bestBefore = parseInt(line.split(' ')[3]);
            const numRoles = parseInt(line.split(' ')[4]);
            
            const roles:Skill[] = [];
            for(let skillIndex=0; skillIndex<numRoles; skillIndex++){
                line = this.lines[this.lineIndex++];
                const skillName = line.split(' ')[0];
                const skillLevel = parseInt(line.split(' ')[1]);
                roles.push(new Skill(skillName, skillLevel));
            }

            const project = new Project(projectName, duration, score, bestBefore, roles);
            this.projects.set(projectName, project);
            this.projectsArr.push(project);
        }    
    }

    outputStr = '';
    doneProjects = 0;
    dayIndex = 0;

    public init(){
        this.projectsArr.forEach(el => {
            el.evaluate(this.dayIndex)
        });
        this.projectsArr.sort((a,b) => b.lastEval - a.lastEval);        
    }

    public async run(){        
        console.log(`Simulation ${this.inputIndex} is running !`);
        while(!this.isDone()){
            this.simulate();
        }
    }

    public async simulate(){
        console.log(`worker: ${this.inputIndex}`, `day: ${this.dayIndex}`, `projects remaining: ${this.projectsArr.length}`);
        
        //check if completed
        this.projectsArr.forEach(el => {
            if(el.working && this.dayIndex >= el.workUntil) {
                this.outputStr += el.name + '\n' + el.assignments.map(assignment => assignment.user.name).join(' ') + '\n'
                this.doneProjects++;
                el.complete(this.usersArr);
            }
        });

        //do an pass to make assingments with as many mentors as possible
        this.projectsArr.forEach(el => {
            if(!el.working && !el.completed) {
                el.assign(this.usersArr, this.dayIndex, true)
            }
        }); 
        
        //do another pass to assign any other possible users
        this.projectsArr.forEach(el => {
            if(!el.working && !el.completed) {
                el.assign(this.usersArr, this.dayIndex, false)
            }
        });
    
        this.projectsArr = this.projectsArr.filter(el => {
            return el.working || (!el.completed && el.lastEval > 0);
        });
        this.projectsArr.forEach(el => el.evaluate(this.dayIndex));
        this.projectsArr.sort((a,b) => b.lastEval - a.lastEval);  
        this.dayIndex++;
    }

    public isDone(){
        return this.projectsArr.length == 0;
    }
}