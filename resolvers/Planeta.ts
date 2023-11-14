import { Request, Response } from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";
import { PlanetasModel, PersonasModel } from '../Tardis.ts'


const postPlaneta = async (req: Request, res: Response) => {
    try {
        // Extraer datos del cuerpo de la solicitud
        const { personas } = req.body;

        // Verificar si se proporcionan lo necesario
        if (!personas) {
            return res.status(400).send("Error: se requieren personas");
        }

       //comprobar si ID es valido y buscar el ID en la DB
        const arrayPersonas = await Promise.all(personas.map(async (id: string) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).send("Error: ID de personas no es un tipo válido");
            }

            const aux = await PersonasModel.findById(id).exec();

            if (!aux) {
                return res.status(400).send("Error: persona no encontrada");
            }

            return { id: aux._id.toString(), nombre: aux.nombre };
        }));

        // Crear un nuevo planeta con las personas proporcionadas
        const newPlaneta = new PlanetasModel({ id_personas: personas });
        await newPlaneta.save();

        // Enviar la información del planeta creado
        return res.status(200).send({
            id: newPlaneta._id.toString(),
            id_personas: newPlaneta.id_personas
        });

    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const getPlaneta = async (req: Request, res: Response) => {
    try {
        // Extraer el ID del planeta 
        const { id } = req.params;

        // Encontrar el planeta especificado y relacionarlo con las personas usando metodo populate
        const planeta = await PlanetasModel.findById(id).populate("id_personas").exec();

        // Verificar si el planeta existe
        if (!planeta) {
            return res.status(404).send("Error: planeta no encontrado");
        }

        // Enviar la información del planeta y las personas asociadas
        return res.status(200).send({
            id: planeta._id.toString(),
            personas: planeta.id_personas.map(persona => ({
                id: persona._id.toString(),
                nombre: persona.nombre
            }))
        });

    } catch (error) {
        return res.status(500).send(error.message);
    }
};


const putPlaneta = async (req: Request, res: Response) => {
    try {
        // Extraer el ID del planeta y datos de las personas 
        const { id } = req.params;
        const { personas } = req.body;

        //verificar que no falten datos
        if (!personas) {
            return res.status(400).send("Error: se requieren personas");
        }

        // comprobar que los ids sean validos y ejecutar consulta
        const arrayPersonas = await Promise.all(personas.map(async (id: string) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).send("Error: ID de personas no es un tipo válido");
            }

            const aux = await PersonasModel.findById(id).exec();

            if (!aux) {
                return res.status(400).send("Error: persona no encontrada");
            }

            return { id: aux._id.toString(), nombre: aux.nombre };
        }));

        // Actualizar el planeta
        const updatedPlaneta = await PlanetasModel.findByIdAndUpdate(
            id,
            { id_personas: personas },
            { new: true }
        ).exec();

        // Verificar que el planeta exista
        if (!updatedPlaneta) {
            return res.status(404).send("Error: Planeta no encontrado");
        }

        // Enviar la información del planeta actualizado
        return res.status(200).send({
            id: updatedPlaneta._id.toString(),
            id_personas: updatedPlaneta.id_personas
        });

    } catch (error) {
        return res.status(500).send(error.message);
    }
};


const deletePlaneta = async (req: Request, res: Response) => {
    try {
        // Extraer el ID del planeta
        const { id } = req.params;

        // Encontrar y eliminar el planeta
        const planeta = await PlanetasModel.findByIdAndDelete(id).exec();

        // Verificar si el planeta existe
        if (!planeta) {
            return res.status(404).send("Error: planeta no encontrado");
        }

        // Verificar si el planeta tiene personas asociadas
        if (planeta.id_personas !== null) {
            const personasIds = planeta.id_personas;

            // Eliminar todas las personas asociadas al planeta
            await Promise.all(personasIds.map(async (personaId) => {
                await PersonasModel.findByIdAndDelete(personaId).exec();
            }));
        }

        return res.status(200).send(`Planeta y las personas asociadas con el planeta ${id} eliminados`);

    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export { postPlaneta, getPlaneta, putPlaneta, deletePlaneta };
