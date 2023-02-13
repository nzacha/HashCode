import { emitKeypressEvents } from "readline";
import { User } from ".";
import Skill from "./Skill";

interface IAssignment{
    user: User;
    role: Skill;
}
export default class Project {
    name: string;
    duration: number;
    score: number;
    bestBefore: number;
    skills: Skill[];

    lastEval: number = 0;

    working: boolean = false;
    workUntil: number = 0;
    assignments: IAssignment[] = [];
        
    completed: boolean = false;

    constructor(name: string, duration: number, score: number, bestBefore: number, skill: Skill[]) {
        this.name = name;
        this.duration = duration;
        this.score = score; 
        this.bestBefore = bestBefore;
        this.skills = skill;
    }

    evaluate(dayIndex: number){
        const estimateToFinish = dayIndex + this.duration;
        const availableScore = estimateToFinish < this.bestBefore 
            ? this.score 
            : this.score - (this.bestBefore - estimateToFinish);
        let score = availableScore / (estimateToFinish + this.bestBefore);
        
        return this.lastEval = score -Math.pow(dayIndex, 1.2) * 0.001;
    }

    //check if user can be assigned to a role
    canAssign(user: User, role: Skill, mentorsOnly: boolean){
        if(user.working) return false;

        const skill = user.skills.get(role.name);
        return skill && skill.skillLevel >= role.skillLevel && (mentorsOnly ? skill.skillLevel == role.skillLevel-1 : true);
    }

    //check if users can work on all the roles
    assign(users: User[], dayIndex: number, mentorsOnly: boolean){
        if(this.working || this.completed) {
            return false;
        } else {
            this.assignments = [];
        }

        this.skills.forEach(role => {
            if(mentorsOnly && !users.find(user => {
                const skill = user.skills.get(role.name);
                return skill && skill.skillLevel >= role.skillLevel
            })) return;

            let assigned = false;
            if(assigned) return;
            for(let i=0; i<users.length; i++){
                const user = users[i];
                if(this.canAssign(user, role, mentorsOnly)){
                    this.assignments.push({user: user, role: role});
                    user.assign(dayIndex + this.duration);
                    assigned = true;
                    users.splice(i, 1);
                    break;
                }
            };
        });

        if(this.assignments.length == this.skills.length){
            this.working = true;
            this.workUntil = dayIndex + this.duration -1;
            return true;
        }else{
            this.assignments.forEach(el => {
                el.user.unassign();
                users.push(el.user);
            });
            this.assignments = [];
            return false;
        }
    }

    complete(users: User[]){
        this.working = false;
        this.completed = true;
        this.assignments.forEach(assignment => {
            assignment.user.unassign();
            users.push(assignment.user);
            
            const skill = assignment.user.skills.get(assignment.role.name);
            if(skill && skill.skillLevel == assignment.role.skillLevel-1){
                skill.skillLevel++;
            }
        });
    }
}