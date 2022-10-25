import { Handler } from 'express';
import { nanoid } from 'nanoid';
import { getConnection } from '../database';

export const getCategories: Handler = (req, res) => {
  const categories = getConnection().get('category').value();
  res.send(categories);
}

export const getCategory: Handler = (req, res) => {
  const categorie = getConnection().get('category').find({ id: req.params.id }).value();
  if (!categorie) {
    return res.status(404).json({ "message": "Category was not found" });
  } else {
    res.send(categorie);
  }
}

export const createCategory: Handler = (req, res) => {
  try {
    const validKeys = ['name', 'id'];
    if (Object.keys(req.body).every(key => validKeys.includes(key))) {
      const { name} = req.body;
      const newCategory = {
        id: nanoid(),
        name,
      };
      getConnection().get('category').push(newCategory).write();
      res.json(newCategory);
    } else {
      res.status(400).json({ "message": "bad request" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

export const updateCategory: Handler = (req, res) => {
  const categorie = getConnection().get('category').find({ id: req.params.id }).value();
  if (!categorie) {
    return res.status(404).json({ "message": "categorie doesnt exists" });
  } else {
    const updatedCategory = getConnection().get('category').find({ id: req.params.id }).assign(req.body).write();
    res.send(updatedCategory);
  }
}

export const deleteCategory: Handler = (req, res) => {
  const categorie = getConnection().get('category').find({ id: req.params.id }).value();
  if (!categorie) {
    return res.status(404).json({ "message": "categorie doesnt exists" });
  } else {
    const deletedCategory = getConnection().get('category').remove({ id: req.params.id }).write();
    res.send(deletedCategory[0]);
  }
}