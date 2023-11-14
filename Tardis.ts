import mongoose from "npm:mongoose@7.6.3";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;




const DimensionesSchema=new Schema({
    id_plan: [{ type: Schema.Types.ObjectId, ref: "planetas" }]
});
//EXPORTAMOS DIMENSION QUE CONTIENE UN ARRAY CON IDS DE PLANETAS
export type DimensionesModelType={
   id:string,
   id_plan:DimensionesModelType[]
}

const PlanetasSchema=new Schema({
    id_per: [{ type: Schema.Types.ObjectId, ref: "dimensiones" }]
});
//EXPORTAMIS PLANETAS QUE CONTIENE UN ARRAY DE IDS DE PERSONAS
export type PlanetasModelType={
   id:string,
   id_per:PlanetasModelType[];
}


const PersonasSchema=new Schema({
    nombre: {type:String,required:true}
});
//TIPO PERSONA QUE CONTIENE NOMBRE DE LA PERSONA
export type PersonasModelType={
    nombre:string,
    id:string
}



const TardisSchema=new Schema({
  camuflaje: {type:String,required:true},
  numero_regeneración: {type:Number,required:true},
  año: {type:Number,required:true},
  id_dim:[{ type: Schema.Types.ObjectId, ref: "dimensiones" }]
});
//POR ULTIMO EL TIPO TARDIS CON EL RESTO DE CARACTERISTICAS PEDIDAS
export type TardisModelType={
  camuflaje: string;
  numero_regeneracion: number;
  ano: number;
  id_dim: DimensionesModelType[];
}



export const DimensionesModel = mongoose.model<DimensionesModelType>("Dimensiones",DimensionesSchema);
export const TardisModel = mongoose.model<TardisModelType>("Tardis",TardisSchema);
export const PersonasModel = mongoose.model<PersonasModelType>("Personas",PersonasSchema);
export const PlanetasModel = mongoose.model<PlanetasModelType>("Planetas",PlanetasSchema);