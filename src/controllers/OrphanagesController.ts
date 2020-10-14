import {Request, Response} from 'express'

import {getRepository} from 'typeorm';

import * as Yup from 'yup';

import orphanageView from '../views/orphanages-view';
import Orphanages from '../models/Orphanages';
import orphanagesView from '../views/orphanages-view';

export default {

  async show(request: Request, response: Response) {
    const {id} = request.params;

    const orphanagesRepository = getRepository(Orphanages);

    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images']
    });

    return response.json(orphanageView.render(orphanage));
  },

  async index(request: Request, response: Response) {
    const orphanagesRepository = getRepository(Orphanages);

    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    });

    return response.json(orphanagesView.renderMany(orphanages));
  },

  async create(request: Request, response: Response) {
    const { 
      name, 
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    } = request.body;

    const requestImages = request.files as Express.Multer.File[];
    
    const images = requestImages.map(image => {
      return { path: image.filename }
    })
  
    const orphanagesRepository = getRepository(Orphanages);
  
    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
      }))
    });

    await schema.validate(data, {
      abortEarly: false, //retorna todos os erros ao mesmo tempo
    })

    const orphanage = orphanagesRepository.create(data);
  
    await orphanagesRepository.save(orphanage);
    
    return response.status(201).json(orphanage);
  }
}