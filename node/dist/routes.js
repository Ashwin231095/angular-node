"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const pg_promise_1 = __importDefault(require("pg-promise"));
const router = express_1.default.Router();
const pgp = pg_promise_1.default({
// Initialization Options
});
const connectionString = `postgresql://postgres:postgres@127.0.0.1:5432/postgres`;
const db = pgp(connectionString);
// define a route handler for the default home page
router.get("/", (req, res) => {
    res.send("Hello world!");
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userName = req.body.user;
    const password = req.body.password;
    const email = req.body.email;
    // tslint:disable-next-line:no-console
    console.log(`the username is '${userName}' and password is '${password}' and email is '${email}'`);
    bcryptjs_1.default.hash(`'${password}'`, 10, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
        yield db.query(`INSERT INTO "public".userData VALUES ('${userName}','${hash}', '${email}')`);
    }));
    res.send('received');
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userName = req.body.user;
    const password = req.body.password;
    const email = req.body.email;
    const hash = yield db.query(`SELECT password FROM  "public".userdata WHERE username = '${userName}'`);
    const hashedElement = hash[0];
    // tslint:disable-next-line:no-console
    console.log(`the username is '${userName}' and password is '${password}' and hash is `, hashedElement.password);
    const result = yield bcryptjs_1.default.compare(`'${password}'`, hashedElement.password.toString());
    const private_key = 'Puckjuly12#$';
    const payload = { useremail: email };
    const token = jsonwebtoken_1.default.sign(payload, private_key, { expiresIn: '8h' });
    res.send(token);
}));
router.get("/resetpassword", (req, res) => {
    const email = req.body.email;
    var transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: 'xyza4111@gmail.com',
            pass: 'Killerkalsa12#$'
        }
    });
    const mailOptions = {
        from: 'xyza4111@gmail.com',
        to: email,
        subject: 'password reset link',
        html: '<p>password reset link</p>' // plain text body
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log(info);
    });
    res.send('password reset link has sent to your email');
});
exports.default = router;
//# sourceMappingURL=routes.js.map