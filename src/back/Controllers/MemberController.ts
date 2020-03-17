import * as express from "express"
import IMemberService from "../Services/IMemberService";
import IMember from "../Models/IMember";

/**
 * Process the API requests dedicated to member operations
 */
export default class MemberController {

    private readonly _expr: express.Express;
    private readonly _memberSvc: IMemberService;

    /**
     * Create instance of controller by setting API routes to get or post member.
     * @param expr The express server instance
     * @param memberSvc The member service to deal with member repository.
     */
    constructor(expr: express.Express, memberSvc: IMemberService) {
        this._expr = expr;
        this._memberSvc = memberSvc;

        this._expr.get("/api/member/:id?", async (req, res) => { await this.GET_member_id(req, res); });
        this._expr.post("/api/member",  async (req, res) => { await this.POST_member(req, res); });
        this._expr.put("/api/member/:id?",  async (req, res) => { await this.PUT_member_email(req, res); });
        this._expr.delete("/api/member/:id?",  async (req, res) => { await this.DELETE_member(req, res); });

        console.debug("MemberController is ready !");
    }

    /**
     * Process of API request : GET /api/member/{member id}
     * Returns the member according to the specified id if any. Otherwise, returns all members of repository. 
     * @returns : Array of member with status code 200 if success.
     * If id is specified and member does not exists, return en empty array with status code 404.
     */
    private async GET_member_id(req: express.Request, res: express.Response) {

        let data: IMember[] = [];
        let errMsg: string = "";
        let statusCode: number = 200;

        if (req.params.id !== undefined) { // Returns member that match the specified id
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw new Error("Member id parameter is not valid");
            
            const member = await this._memberSvc.getByIdOrNull(id);
            if (member !== null) { // Member found
                member.password = "";
                data.push(member);
            }
            else {
                errMsg = "Member does not exists";
                statusCode = 404;
            }
        }
        else { // Returns all members
            const allMembers = await this._memberSvc.getAll();
            for (let member of allMembers) {
                member.password = "";
                data.push(member);
            }
        }

        res.statusCode = statusCode;
        if (errMsg !== "") res.statusMessage = errMsg;
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    }

    /**
     * Process of API request : POST /api/member.
     * Create new member in the repository.
     * @returns: The id of created member.
     */
    private async POST_member(req: express.Request, res: express.Response) {

        try {
            const member: IMember = req.body;
            if (member.email === "")
                throw new Error("Missing email");
            if (member.password === "")
                throw new Error("Missing password");

            const id = await this._memberSvc.create(member);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');

            res.json(id);
        }
        catch(err) {
            res.statusCode = 400;
            res.statusMessage = err.message;
            res.setHeader('Content-Type', 'application/json');

            res.json(0);
        }
    }
    
    /**
     * Process of API request : PUT /api/member/{member id}
     * Modify a member in the repository from id
     * @returns : Status code 200 if success.
     */
    private async PUT_member_email(req: express.Request, res: express.Response) {

        try {
            const id = parseInt(req.params.id);
            const email = req.body.email;
            if (email === "")
                throw new Error("Missing email")

            await this._memberSvc.put(id, email);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.send(true);

        } catch (err) {
            res.statusCode = 400;
            res.statusMessage = err.message;
            res.setHeader('Content-Type', 'application/json');

            res.send(false);
        }
    }

      /**
     * Process of API request : DELETE /api/member/{member id}
     * Delete a member in the repository from id
     * @returns : Status code 200 if success.
     */
    private async DELETE_member(req: express.Request, res: express.Response) {

        try {
            const id = parseInt(req.params.id);
            const member = await this._memberSvc.delete(id);

            if (member) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.send(true);
            } else {
                throw new Error("This member doesn't exist");
            }
        } catch (err) {
            res.statusCode = 400;
            res.statusMessage = err.message;
            res.setHeader('Content-Type', 'application/json');

            res.send(false);
        }
    }

}