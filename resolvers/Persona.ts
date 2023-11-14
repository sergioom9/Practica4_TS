import mongoose from "npm:mongoose@7.6.3";
import express, { Request, Response } from "npm:express@4.18.2";
import { PersonasModel } from '../Tardis.ts'; // Asegúrate de importar tu modelo de Persona correctamente

const postPersona = async (req: Request, res: Response) => {
    try {
        
        const { nombre } = req.body;

        // Verificar si se proporcionaron los datos necesarios
        if (!nombre) {
            res.status(400).send("Error: Nombre is required");
            return;
        }
       
        // Crear una nueva Persona con los datos proporcionados
        const newPersona = new PersonasModel({ nombre });
        
        // Guardar la nueva persona
        await newPersona.save();
        
        // Enviar la información de la nueva persona
        res.status(200).send({
            id: newPersona._id.toString(),
            nombre: newPersona.nombre
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
};


const getPersona = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Buscar una persona por su ID en la base de datos
        const persona = await PersonasModel.findById(id).exec();

        // Verificar si la persona existe
        if (!persona) {
            res.status(404).send("Error: Persona not found");
            return;
        }

        // Enviar la información de la persona encontrada
        res.status(200).send({
            id: persona._id.toString(),
            nombre: persona.nombre
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
};


// Función para actualizar información de una persona por su ID
const putPersona = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        // Verificar si se proporcionaron los datos necesarios
        if (!nombre) {
            res.status(400).send("Error: Nombre is required");
            return;
        }

        // Actualizar la información de la persona con el ID dado
        const updatedPersona = await PersonasModel.findByIdAndUpdate(
            id,
            { nombre },
            { new: true }
        ).exec();

        // Verificar si la persona fue actualizada correctamente
        if (!updatedPersona) {
            res.status(404).send("Error: Persona not found");
            return;
        }

        // Enviar la información actualizada de la persona
        res.status(200).send({
            id: updatedPersona._id.toString(),
            nombre: updatedPersona.nombre
        });

    } catch (error) {
       res.status(500).send(error.message);
    }
};



const deletePersona = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Buscar y eliminar una persona por su ID
        const persona = await PersonasModel.findByIdAndDelete(id).exec();

        // Verificar si la persona existe
        if (!persona) {
            res.status(404).send("Error: Persona not found");
            return;
        }

        // Enviar que la persona fue eliminada correctamente
        res.status(200).send("Persona deleted");

    } catch (error) {
        res.status(500).send(error.message);
    }
};



export {postPersona,getPersona,putPersona,deletePersona };
