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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const Ticket_1 = __importDefault(require("./models/Ticket"));
const Ticket_2 = require("./models/Ticket");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Ticket_2.sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    res.send('API up and running.');
}));
app.get("/api/v1/tickets/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield Ticket_1.default.findAll({ order: [['updatedAt', 'DESC']] });
    res.send({ tickets });
}));
app.post('/api/v1/tickets/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield Ticket_1.default.create({
        details: req.body.details,
        state: req.body.state
    });
    yield ticket.save();
    res.send({ message: `Ticket ${ticket.getDataValue("id")} created succesfully` });
}));
app.get('/api/v1/tickets/:ticketid/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    const ticket = yield Ticket_1.default.findByPk(req.params.ticketid);
    res.send({ ticket });
}));
app.put('/api/v1/tickets/:ticketid/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield Ticket_1.default.findByPk(req.params.ticketid);
    ticket === null || ticket === void 0 ? void 0 : ticket.set({
        details: req.body.details,
        state: req.body.state
    });
    ticket === null || ticket === void 0 ? void 0 : ticket.save();
    res.send({ message: `Ticket ${ticket === null || ticket === void 0 ? void 0 : ticket.getDataValue("id")} updated succesfully` });
}));
app.delete('/api/v1/tickets/:ticketid/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    const ticket = yield Ticket_1.default.findByPk(req.params.ticketid);
    ticket === null || ticket === void 0 ? void 0 : ticket.destroy();
    res.send({ message: "Ticket deleted succesfully" });
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
