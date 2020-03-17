import * as express from "express"
import path from "path"
import util from "util"
import fs from "fs"
import FileMemberService from "./Services/FileMemberService"
import MemberController from "./Controllers/MemberController"


////// Setup express server
const expr = express();
expr.use(express.json()); // To enable JSON resquest parsing


////// Setup services
const memberSvc = new FileMemberService();

////// Setup routes

// To serve the default page
expr.get("/", async (req, res) => { 
    const pagePath = path.join(__dirname, "/../index.html");
    const readFileAsync = util.promisify(fs.readFile);
    res.status(200).send(await readFileAsync(pagePath, { encoding: "utf8", flag: "r" }));
});

// To serve static files from dist
expr.use('/dist', express.static(path.resolve(__dirname)));

// The controllers
const memberController = new MemberController(expr, memberSvc);


////// Start server
const port = 8086;
const hostname = "localhost";
expr.listen(port, hostname, async () => { 
    console.log("Ready ! The Server is listening on %s:%d ...", hostname, port);
});
