import { Sequelize, Model, DataTypes } from 'sequelize';

export const sequelize = new Sequelize('sqlite::memory:');
const Ticket = sequelize.define('Ticket', {
  details: DataTypes.TEXT,
  state: DataTypes.ENUM({values:['open','in-progress','code-review']}),
});

const modelSync = async()=>{
    await Ticket.sync({ alter: true });

}
modelSync()

export default Ticket