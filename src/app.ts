import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user';
import messageRoutes from './routes/message';
import groupRoutes from './routes/group';
import sequelize from './database/db';
import http from 'http';

const app = express();

const httpServer = http.createServer(app);
import initSocketServer from './socketServer';

const io = initSocketServer(httpServer);

app.use(express.json());
app.use(
    cors(
        {
            origin:"http://localhost:3000"
        }
    )
    );

app.use((req:any, res:any, next)=>{
    req.io = io;
    next();
});

app.use('/message', messageRoutes);
app.use('/', userRoutes);
app.use('/group', groupRoutes);



// synchronizing the sequellize
sequelize.sync()
.then(()=>{
    httpServer.listen(5000, async()=>{
        console.log('server started at port 5000')
        try{
            await sequelize.authenticate();
            console.log('connection has been established successfully.');
        } catch(error){
            console.error('unable to connect to the database:', error);
        }
    });
})
.catch((err)=>{
    console.error('error synchronizing the database', err);
})