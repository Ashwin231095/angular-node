import express, { json } from "express";
import routers from './routes'


const app = express();
const port = 8080; // default port to listen
app.use(json());

app.use('/', routers);

// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );
