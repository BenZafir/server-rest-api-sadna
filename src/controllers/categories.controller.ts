import { Handler } from 'express';
import { isUserAllowed } from '../auth';
import { CategoryService } from '../services/categoryService';

export const getCategories: Handler = (req, res) => {
  const categories = CategoryService.getInstance().getall();
  res.send(categories);
}

export const getCategory: Handler = (req, res) => {
  const category = CategoryService.getInstance().getById(req.params.id);
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
    const categoryService = CategoryService.getInstance();
    if(!categoryService.checkDataValid(req.body)){
      res.status(400).json({ "message": "bad request" });
      return;
    };
    if(categoryService.checkDataExist(req.body.name)){
      res.status(400).json({ "message": "bad request" });
      return;
    };
      const newCategory = categoryService.create(req.body);
      res.json(newCategory);
  } catch (error) {
    res.status(500).send(error);
  }
}

export const updateCategory: Handler = async (req, res) => {
  const adminPermissionRequired = true
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth){
    return res.status(404).json({"message": "wronge token"});
  }
  const categoryService = CategoryService.getInstance();
  const category = categoryService.getById(req.params.id);
  if (!category) {
    return res.status(404).json({ "message": "category doesnt exists" });
  } else {
    const updatedCategory = categoryService.update(req.params.id, req.body);
    res.send(updatedCategory);
  }
}

export const deleteCategory: Handler = async (req, res) => {
  const adminPermissionRequired = true
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth){
    return res.status(404).json({"message": "wronge token"});
  }
  const categoryService = CategoryService.getInstance();
  const category = categoryService.getById(req.params.id);
  if (!category) {
    return res.status(404).json({ "message": "category doesnt exists" });
  } else {
    const deletedCategory = categoryService.delete(req.params.id);
    res.send(deletedCategory);
  }
}