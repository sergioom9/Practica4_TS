import mongoose from "npm:mongoose@7.6.3";
import express, { Request, Response } from "npm:express@4.18.2";
import {DimensionesModel,PlanetasModel, PersonasModel,TardisModel } from '../Tardis.ts'



const postTardis = async (req: Request, res: Response) => {
    try {
        //cogemos los valores del body de la request
        const { camuflaje, numero_regeneracion, ano, dimensiones } = req.body;
        //comprobamos que tenemos todo lo necesario
        if (!camuflaje || !numero_regeneracion || !ano || !dimensiones) {
            return res.status(400).send("Error: camuflaje, numero de regeneracion, ano, and dimensiones are required");
        }
        //creamos una funcion para verificar si el ID es valido
        const arrayDimensiones = await Promise.all(dimensiones.map(async (id: string) => {
            if (!mongoose.Types.ObjectId.isValid(id)) { //funcion y metodos conseguidos con ayuda de un compañero
                return res.status(400).send("Error: dimensiones id not a valid type");
            }
            //ejecutamos el metodo para encontrar en la DB por id
            const aux = await DimensionesModel.findById(id).exec();

            if (!aux) {
                //verificamos que las dimensiones introducidas en el body existan
                return res.status(400).send("Error: dimensiones not found");
            }

            return { id: aux._id.toString() };
        }));
        //finalmente creamos el Tardis
        const newTardis = new TardisModel({ camuflaje, numero_regeneracion, ano, id_dimensiones: dimensiones });
        await newTardis.save();
        //devolvemos los datos usados para crear el Tardis
        return res.status(200).send({
            id: newTardis._id.toString(), //metodo buscado en internet
            camuflaje: newTardis.camuflaje,
            numero_regeneracion: newTardis.numero_regeneracion,
            ano: newTardis.ano,
            id_dimensiones: newTardis.id_dimensiones,
        });

    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const getTardis = async (req: Request, res: Response) => {
    try {
        //gaurdamos el id para hacer la busqueda
        const { id } = req.params;
        //ejecutamos busqueda por ID
        const tardis = await TardisModel.findById(id).populate({
            //usamos metodos populate para relacionar las DB
            path: "id_dimensiones",
            populate: {
                path: "id_planetas",
                populate: {
                    path: "id_personas"
                }
            }
        }).exec();

        if (!tardis) {
            return res.status(404).send("Error: tardis not found");
        }
        //devolvemos todo lo encontrado mediante la relacion
        return res.status(200).send({
            id: tardis._id.toString(),
            camuflaje: tardis.camuflaje,
            ano: tardis.ano,
            dimensiones: tardis.id_dimensiones.map(dimension => ({
                id: dimension._id.toString(),
                planetas: dimension.id_planetas.map(planeta => ({
                    id: planeta._id.toString(),
                    personas: planeta.id_personas.map(persona => ({
                        id: persona._id.toString(),
                        nombre: persona.nombre,
                    }))
                }))
            }))
        });

    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const putTardis = async (req: Request, res: Response) => {
    try {
        //cogemos el id del tardis a actualizar y el body para hacer el cambio
        const { id } = req.params;
        const { camuflaje, numero_regeneracion, ano, dimensiones } = req.body;
        //comprobamos que tengamos todo lo necesario
        if (!camuflaje || !numero_regeneracion || !ano || !dimensiones) {
            return res.status(400).send("Error: camuflaje, numero de regeneracion, ano, and dimensiones are required");
        }
        //comprobamos que el ID sea valido
        const arrayDimensiones = await Promise.all(dimensiones.map(async (id: string) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).send("Error: dimensiones id not a valid type");
            }
            //comprobamos que dimension exista
            const aux = await DimensionesModel.findById(id).exec();

            if (!aux) {
                return res.status(400).send("Error: dimensiones not found");
            }

            return { id: aux._id.toString() };
        }));
        //devolvemos los datos del tardis actualizado
        const updatedTardis = await TardisModel.findByIdAndUpdate(
            id,
            { camuflaje, numero_regeneracion, ano, id_dimensiones: dimensiones },
            { new: true }
        ).exec();

        if (!updatedTardis) {
            return res.status(404).send("Error: Tardis not found");
        }

        return res.status(200).send({
            id: updatedTardis._id.toString(),
            camuflaje: updatedTardis.camuflaje,
            numero_regeneracion: updatedTardis.numero_regeneracion,
            ano: updatedTardis.ano,
            id_dimensiones: updatedTardis.id_dimensiones,
        });

    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const deleteTardis = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        //usamos id para hacer delete en la base de datos
        const tardis = await TardisModel.findByIdAndDelete(id).exec();

        if (!tardis) {
            return res.status(404).send("Error: tardis not found");
        }
        //mediante una serie de metodos conseguimos borrar todas sus relaciones de otras DB
        if (tardis.id_dimensiones !== null) {
            const dimensionesIds = tardis.id_dimensiones;

            await Promise.all(dimensionesIds.map(async (dimensionId) => {
                const dimension = await DimensionesModel.findByIdAndDelete(dimensionId).exec();

                if (dimension && dimension.id_planetas !== null) {
                    const planetasIds = dimension.id_planetas;

                    await Promise.all(planetasIds.map(async (planetaId) => {
                        const planeta = await PlanetasModel.findByIdAndDelete(planetaId).exec();

                        if (planeta && planeta.id_personas !== null) {
                            const personasIds = planeta.id_personas;

                            await Promise.all(personasIds.map(async (personaId) => {
                                await PersonasModel.findByIdAndDelete(personaId).exec();
                            }));
                        }
                    }));
                }
            }));
        }

        return res.status(200).send(`Tardis, dimensiones, planetas, and personas associated with Tardis ${id} deleted`);

    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export { postTardis, getTardis, putTardis, deleteTardis };
