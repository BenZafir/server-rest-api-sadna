import { Handler } from 'express';
import { nanoid } from 'nanoid';
import { getConnection } from '../database';

export const getItems: Handler = (req, res) => {
  const categories = getConnection().get('items').value();
  res.send(categories);
}

export const getItem: Handler = (req, res) => {
  const categorie = getConnection().get('items').find({ id: req.params.id }).value();
  if (!categorie) {
    return res.status(404).json({ "message": "Item was not found" });
  } else {
    res.send(categorie);
  }
}

export const createItem: Handler = (req, res) => {
  try {
    const validKeys = ['name', 'id', 'img', 'category', 'price' ];
    if (Object.keys(req.body).every(key => validKeys.includes(key))) {
      const { name, img, category, price} = req.body;
      const newItem = {
        id: nanoid(),
        name,
        img,
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

export const updateItem: Handler = (req, res) => {
  const categorie = getConnection().get('items').find({ id: req.params.id }).value();
  if (!categorie) {
    return res.status(404).json({ "message": "categorie doesnt exists" });
  } else {
    const updatedItem = getConnection().get('items').find({ id: req.params.id }).assign(req.body).write();
    res.send(updatedItem);
  }
}

export const deleteItem: Handler = (req, res) => {
  const categorie = getConnection().get('items').find({ id: req.params.id }).value();
  if (!categorie) {
    return res.status(404).json({ "message": "categorie doesnt exists" });
  } else {
    const deletedItem = getConnection().get('items').remove({ id: req.params.id }).write();
    res.send(deletedItem[0]);
  }
}