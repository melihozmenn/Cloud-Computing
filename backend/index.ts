import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import checkDatabaseConnection from './database';
import errorHandler from './errorHandler';
import Todo, { ITodo } from './to-do';
import { ObjectId } from 'mongoose';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(checkDatabaseConnection);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get("/", async (req: Request, res: Response) => {
    try {
        const todos = await Todo.find();
        if (!todos || todos.length < 1) {
            return res.status(404).send("Yapılacak iş bulunamadı");
        }
        res.send(todos);
    } catch (error) {
        res.status(500).send("Bir hata oluştu");
    }
});


app.post("/", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (!data)
            return res.status(400).send("Hatalı istek");

        const todo: ITodo = new Todo({
            description: data.description,
            status: false
        });

        const result = await todo.save();

        if (!result) {
            console.log("Kayıt sırasında hata oluştu")
            return res.status(500).send("Kayıt sırasında hata oluştu");
        }

        res.send(req.body);
    }
    catch (err) {
        console.log(err)
        res.send(err);
    }
});


app.put("/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id)
            return res.status(400).send("Hatalı istek");

        const todo = await Todo.findOne({ _id: id });

        if (!todo) {
            console.log("Kayıt bulunamadı")
            return res.status(404).send("Kayıt bulunamadı");
        }

        todo.status = !todo.status;

        const result = await todo.save();

        res.send(result);
    }
    catch (err) {
        console.log(err)
        res.send(err);
    }
});

app.put("/", async (req: Request, res: Response) => {
    try {
        const ids = req.body.ids;

        if (!ids)
            return res.status(400).send("Hatalı istek");

        const todos = await Todo.find({ _id: { $in: ids } });

        if (!todos) {
            console.log("Kayıt bulunamadı")
            return res.status(404).send("Kayıt bulunamadı");
        }

        todos.forEach(async todo => {
            todo.status = !todo.status;
            await todo.save();
        });

        res.send(todos);
    }
    catch (err) {
        console.log(err)
        res.send(err);
    }

});


app.delete("/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id)
            return res.status(400).send("Hatalı istek");

        const todo = await Todo.findByIdAndDelete(id);

        if (!todo) {
            console.log("Kayıt bulunamadı")
            return res.status(404).send("Kayıt bulunamadı");
        }

        res.send(todo);
    }
    catch (err) {
        console.log(err)
        res.send(err);
    }
});

app.delete("/", async (req: Request, res: Response) => {
    try {
        const ids = req.body.ids;
        console.log(ids)

        if (!ids)
            return res.status(400).send("Hatalı istek");

        const result = await Todo.deleteMany({ _id: { $in: ids } });

        if (!result) {
            return res.status(500).send("Silme işlemi sırasında hata oluştu");

        }

        res.send(result);

    }
    catch (err) {
        console.log(err)
        res.send(err);
    }

});
