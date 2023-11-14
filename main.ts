import mongoose from "npm:mongoose@7.6.3";
import express, { Request, Response } from "npm:express@4.18.2";
import { postDimension,getDimension,putDimension,deleteDimension } from "./resolvers/Dimension.ts";
import { postPersona, getPersona,putPersona,deletePersona} from "./resolvers/Persona.ts";
import { postPlaneta,getPlaneta,putPlaneta,deletePlaneta } from "./resolvers/Planeta.ts";
import { postTardis,getTardis,putTardis,deleteTardis } from "./resolvers/Tardis.ts";


console.log("Intentando conectarme a mongoo...");
try{

await mongoose.connect("mongodb+srv://sergioom9:nebrija22@cluster0.9dzkoo1.mongodb.net/?retryWrites=true&w=majority");
console.log("Conectado a mongo...");

//creacion de express y metodo para usar datos en formato JSON 
const miapp =express();
miapp.use(express.json());


miapp

//todos los metodos y sus respectivas rutas
.get("/get_tardis/:id", getTardis) 
.post("/post_tardis", postTardis) 
.put("/put_tardis/:id", putTardis) 
.delete("/delete_tardis/:id", deleteTardis) 

.get("/get_dimension/:id", getDimension) 
.post("/post_dimension", postDimension) 
.put("/put_dimension/:id", putDimension) 
.delete("/delete_dimension/:id", deleteDimension) 

.get("/get_planeta/:id", getPlaneta) 
.post("/post_planeta", postPlaneta) 
.put("/put_planeta/:id", putPlaneta) 
.delete("/delete_planeta/:id", deletePlaneta) 

.get("/get_persona/:id", getPersona) 
.post("/post_persona", postPersona) 
.put("/put_persona/:id", putPersona) 
.delete("/delete_persona/:id", deletePersona) 

miapp.listen(3000, () => {
    console.log("Server listening on port 3000");
});

}catch(e){
    console.log("No ha sido posible conectarse a MongoDb");
}