import Skill from "./Skill";

export default class User {
    name: string;
    skills: Map<string, Skill>;
    working: boolean;
    workUntil?: number;

    constructor(name: string, skills: Map<string, Skill>){
        this.name = name;
        this.skills = skills;
        this.working = false;
    }

    assign(workUntil: number){
        this.working = true;
        this.workUntil = workUntil;
    }

    unassign(){
        this.working = false;
    }
}