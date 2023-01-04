import { Handler } from 'express';
import { nanoid } from 'nanoid';
import { getConnection } from '../database/database';
import { isUserAllowed } from '../auth';
import { ItemService } from '../services/itemService';

export const getItems: Handler = async (req, res) => {
  const items = ItemService.getInstance().getall();
  res.send(items);
}

export const getItem: Handler = async (req, res) => {
  
  const item = ItemService.getInstance().getById(req.params.id);
  if (!item) {
    return res.status(404).json({ "message": "Item was not found" });
  } else {
    res.send(item);
  }
}

export const createItem: Handler = async (req, res) => {
  const adminPermissionRequired = true;
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if (!auth)
    return res.status(404).json({ "message": "wronge token" });
  try {
    const itemService = ItemService.getInstance();
    if(!itemService.checkDataValid( req.body)){
      res.status(400).json({ "message": "bad request" });
      return;
    }
    if(itemService.checkDataExist(req.body.name)){
      res.status(400).json({ "message": "bad request" });
      return;
    }
    let item = itemService.create(req.body);
    if (item == null) {
      res.status(400).json({ "message": "bad category" });
      return;
    }
    res.json();
  } catch (error) {
    res.status(500).send(error);
  }
}

export const updateItem: Handler = async (req, res) => {
  const adminPermissionRequired = true
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if (!auth)
    return res.status(404).json({ "message": "wronge token" });

  const itemService = ItemService.getInstance();
  const item = itemService.getById(req.params.id);
  if (!item) {
    return res.status(404).json({ "message": "categorie doesnt exists" });
  }
  else {
    const categoryCheck = getConnection().get('categories').find({ name: req.body.category }).value();
    if (!categoryCheck) {
      res.status(400).json({ "message": "bad request" });
      return; 
    }
    const updatedItem = itemService.update(req.params.id, req.body);
    res.send(updatedItem);
  }
}


export const deleteItem: Handler = async (req, res) => {
  const adminPermissionRequired = true;
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if (!auth)
    return res.status(404).json({ "message": "wronge token" });
  
  const itemService = ItemService.getInstance();
  const item = itemService.getById(req.params.id);
  if (!item) {
    return res.status(404).json({ "message": "categorie doesnt exists" });
  } else {
    const deletedItem = itemService.delete(req.params.id);
    res.send(deletedItem);
  }
}