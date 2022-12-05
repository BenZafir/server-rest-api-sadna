import { Handler } from 'express';
import { nanoid } from 'nanoid';
import { getConnection } from '../database';
import  { isUserAllowed } from '../auth';

export const getItems: Handler = async (req, res) => {

  const categories = getConnection().get('items').value();
  res.send(categories);
}

export const getItem: Handler = async (req, res) => {

  const categorie = getConnection().get('items').find({ id: req.params.id }).value();
  if (!categorie) {
    return res.status(404).json({ "message": "Item was not found" });
  } else {
    res.send(categorie);
  }
}

export const createItem: Handler = async (req, res) => {
  const adminPermissionRequired = true;
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth)
    return res.status(404).json({"message": "wronge token"});
  try {
    const validKeys = ['name', 'id', 'imageUrl', 'category', 'price' ];
    if (Object.keys(req.body).every(key => validKeys.includes(key))) {
      const { name, imageUrl, category, price} = req.body;
      const categoryCheck = getConnection().get('categories').find({ name: category }).value();
      if(!categoryCheck)
      {
        res.status(400).json({ "message": "bad request" });
        return;
      }
      const newItem = {
        id: nanoid(),
        name,
        imageUrl,
        category,
        price,
      };
      getConnection().get('items').push(newItem).write();
      res.json(newItem);
    } else {
      res.status(400).json({ "message": "bad request" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

export const updateItem: Handler = async (req, res) => {
  const adminPermissionRequired = true
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth)
    return res.status(404).json({"message": "wronge token"});

  const item = getConnection().get('items').find({ id: req.params.id }).value();
  if (!item) {
    return res.status(404).json({ "message": "categorie doesnt exists" });
  }
   else {
    const categoryCheck = getConnection().get('categories').find({ name: req.body.category }).value();
    if(!categoryCheck)
    {
      res.status(400).json({ "message": "bad request" });
      return;
    }
    const updatedItem = getConnection().get('items').find({ id: req.params.id }).assign(req.body).write();
    res.send(updatedItem);
  }
}


export const deleteItem: Handler = async (req, res) => {
  const adminPermissionRequired = true;
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth)
    return res.status(404).json({"message": "wronge token"});
  const categorie = getConnection().get('items').find({ id: req.params.id }).value();
  if (!categorie) {
    return res.status(404).json({ "message": "categorie doesnt exists" });
  } else {
    const deletedItem = getConnection().get('items').remove({ id: req.params.id }).write();
    res.send(deletedItem[0]);
  }
}