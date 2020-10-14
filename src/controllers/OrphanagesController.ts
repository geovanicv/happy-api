import {Request, Response} from 'express'

import {getRepository} from 'typeorm';

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
  
    const orphanage = orphanagesRepository.create({
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    });
  
    await orphanagesRepository.save(orphanage);
    
    return response.status(201).json(orphanage);
  }
}