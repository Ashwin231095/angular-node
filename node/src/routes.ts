import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import pgPromise from "pg-promise";

const router = express.Router();

const pgp = pgPromise({
    // Initialization Options
});

const connectionString = `postgresql://postgres:postgres@127.0.0.1:5432/postgres`;
const db =  pgp(connectionString);

interface hashTypes {
    password: string;
}

// define a route handler for the default home page
router.get( "/", (req, res: any) => {
    res.send( "Hello world!" );
} );

router.post( "/signup", async (req, res: any) => {
    const userName= req.body.user;
    const password = req.body.password;
    const email = req.body.email;
    // tslint:disable-next-line:no-console
    console.log(`the username is '${userName}' and password is '${password}' and email is '${email}'`);
    bcrypt.hash(`'${password}'`, 10, async (err, hash) => {    
        await db.query(`INSERT INTO "public".userData VALUES ('${userName}','${hash}', '${email}')`);
    });
    res.send('received')
} );

router.post( "/login", async (req, res: any) => {
    const userName: string = req.body.user;
    const password: string = req.body.password;
    const email: string = req.body.email;
    const hash = await db.query(`SELECT password FROM  "public".userdata WHERE username = '${userName}'`);
    const hashedElement: hashTypes = hash[0]
    // tslint:disable-next-line:no-console
    console.log(`the username is '${userName}' and password is '${password}' and hash is `, hashedElement.password);
    const result = await bcrypt.compare(`'${password}'`, hashedElement.password.toString());
    const private_key = 'Puckjuly12#$';
    const payload = {useremail : email};
    const token = jwt.sign(payload, private_key, {expiresIn: '8h'});
    res.send(token);
} );

router.get("/resetpassword", (req, res) => {
    const email: string = req.body.email;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'xyza4111@gmail.com',
               pass: 'Killerkalsa12#$'
           }
       });

    const mailOptions = {
        from: 'xyza4111@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'password reset link', // Subject line
        html: '<p>password reset link</p>'// plain text body
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
        });

    res.send('password reset link has sent to your email');
});

export default router;