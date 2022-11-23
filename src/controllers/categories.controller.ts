import { Handler } from 'express';
import { nanoid } from 'nanoid';
import { isUserAllowed } from '../auth';
import { getConnection } from '../database';

export const getCategories: Handler = (req, res) => {
  const categories = getConnection().get('categories').value();
  res.send(categories);
}

export const getCategory: Handler = (req, res) => {
  const category = getConnection().get('categories').find({ id: req.params.id }).value();
  if (!category) {
    return res.status(404).json({ "message": "Category was not found" });
  } else {
    res.send(category);
  }
}

export const createCategory: Handler = async(req, res) => {
  const adminPermissionRequired = true
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth)
    return res.status(404).json({"message": "wronge token"});
  try {
    const validKeys = ['name', 'id','imageUrl'];
    if (Object.keys(req.body).every(key => validKeys.includes(key))) {
      const { name,imageUrl} = req.body;
      const newCategory = {
        id: nanoid(),
        name,
        imageUrl
      };
      getConnection().get('categories').push(newCategory).write();
      res.json(newCategory);
    } else {
      res.status(400).json({ "message": "bad request" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

export const updateCategory: Handler = async (req, res) => {
  const adminPermissionRequired = true
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth)
    return res.status(404).json({"message": "wronge token"});
  const category = getConnection().get('categories').find({ id: req.params.id }).value();
  if (!category) {
    return res.status(404).json({ "message": "category doesnt exists" });
  } else {
    const updatedCategory = getConnection().get('categories').find({ id: req.params.id }).assign(req.body).write();
    res.send(updatedCategory);
  }
}

export const deleteCategory: Handler = async (req, res) => {
  const adminPermissionRequired = true
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth)
    return res.status(404).json({"message": "wronge token"});
  const category = getConnection().get('categories').find({ id: req.params.id }).value();
  if (!category) {
    return res.status(404).json({ "message": "category doesnt exists" });
  } else {
    const deletedCategory = getConnection().get('categories').remove({ id: req.params.id }).write();
    res.send(deletedCategory[0]);
  }
}