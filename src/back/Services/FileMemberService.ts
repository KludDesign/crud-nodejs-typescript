import IMemberService from "./IMemberService";
import IMember from "../Models/IMember";
import fs from "fs"
import path from "path"


/**
 * Abstraction of JSON stored in '/repositories' folder. Convenient for typing persistent data.
 */
interface IMemberRepository {

    idCounter: number;

    members: IMember[];

}


/**
 * Provide a file member servive to save all members in a file as JSON format.
 */
export default class FileMemberService implements IMemberService {

    private readonly _repoPath: string;

    constructor() {
        this._repoPath = path.join(__dirname, "/../repositories/member-repo.json");

        if (!fs.existsSync(this._repoPath)) { // Create an empty repo
            this._commit({ idCounter: 0, members: [] });
        }
    }

    /**
     * Open and returns repo from file.
     * @param repoPath The path of repository file
     */
    private _openRepo(): IMemberRepository {
        return JSON.parse(fs.readFileSync(this._repoPath).toString("utf8"));
    }

    /**
     * Save repo in file.
     * @param repoPath The path of repository file
     * @param repo The repository to save
     */
    private _commit(repo: IMemberRepository) {
        fs.writeFileSync(this._repoPath, JSON.stringify(repo), { encoding: "utf8" });
    }

    /**
     * Gets member of repo that match the specified id.
     * @param repo The repository
     * @param id The id to find
     * @returns The member if any, null otherwise.
     */
    private _getMemberById(repo: IMemberRepository, id: number): IMember | null {
        for(let member of repo.members) {
            if (member.id === id) return member;
        }

        return null;
    }

    //#region Implementation of IMemberService

    getAll(): Promise<IMember[]> {

        const execProm = (resolve: (member: IMember[]) => void, reject: () => void) => {

            const repo = this._openRepo();

            let members: IMember[] = [];
            for (let member of repo.members)
                members.push(member);

            resolve(repo.members);

        }

        return new Promise<IMember[]>(execProm);
    }

    getByIdOrNull(id: number): Promise<IMember | null> {

        const execProm = (resolve: (member: IMember | null) => void, reject: () => void) => {

            const repo = this._openRepo();
            resolve(this._getMemberById(repo, id));
            
        }

        return new Promise<IMember | null>(execProm);
    }

    create(member: IMember): Promise<number> {

        const execProm = (resolve: (id: number) => void, reject: (err: Error) => void) => {

            const repo = this._openRepo();

            member.email = member.email.toLowerCase();
            member.id = ++repo.idCounter;
            repo.members.push(member);
            this._commit(repo);

            resolve(member.id);
        }

        return new Promise<number>(execProm);
    }

    delete(id: number): Promise<boolean> {

        const execProm = (resolve: (found: boolean) => void, reject: () => void) => {

            const repo = this._openRepo();

            for (let i = 0 ; i < repo.members.length ; i++) {
                if (repo.members[i].id === id) {
                    repo.members.splice(i, 1);
                    this._commit(repo);
                    resolve(true);
                }
            }

            resolve(false);
        }

        return new Promise<boolean>(execProm);

    }

    put(id: number, email: string): Promise<boolean> {

        const execProm = (resolve: (found: boolean) => void, reject: () => void) => {

            const repo = this._openRepo();

            for (let i = 0 ; i < repo.members.length ; i++) {
                if (repo.members[i].id === id) {
                    repo.members[i].email = email.toLowerCase();
                    this._commit(repo);
                    resolve(true);
                }
            }

            resolve(false);
        }

        return new Promise<boolean>(execProm);

    }

    //#endregion

}