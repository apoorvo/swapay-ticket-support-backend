import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import Ticket from './models/Ticket';
import {sequelize} from "./models/Ticket"
import cors from "cors";

dotenv.config();

const app: Express = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())


app.get('/', async(req: Request, res: Response) => {
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
  res.send('API up and running.');
});

app.get("/api/v1/tickets/",async (req:Request, res: Response) => {
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    const tickets  = await Ticket.findAll({order:[['updatedAt','DESC']]});
    res.send({tickets})
})

app.post('/api/v1/tickets/',async (req:Request,res:Response)=>{
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    const ticket = await Ticket.create({
        details: req.body.details,
        state: req.body.state
    })
    await ticket.save();
    res.send({message:`Ticket ${ticket.getDataValue("id")} created succesfully`})
})


app.get('/api/v1/tickets/:ticketid/',async (req:Request, res: Response) => {
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    console.log(req.params)
    const ticket = await Ticket.findByPk(req.params.ticketid)
    res.send({ticket})
    
})

app.put('/api/v1/tickets/:ticketid/',async (req:Request,res:Response)=>{
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    const ticket = await Ticket.findByPk(req.params.ticketid)
    ticket?.set({
        details: req.body.details,
        state: req.body.state
    })
    ticket?.save();
    res.send({message:`Ticket ${ticket?.getDataValue("id")} updated succesfully`})
})

app.delete('/api/v1/tickets/:ticketid/',async (req:Request, res: Response) => {
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');

    const ticket = await Ticket.findByPk(req.params.ticketid)
    ticket?.destroy()
    res.send({message:"Ticket deleted succesfully"})
})


module.exports = app;