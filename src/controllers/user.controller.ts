import { Handler } from 'express';
import { nanoid } from 'nanoid';
import { getConnection } from '../database';

export const getUsers: Handler = (req, res) => {
  const users = getConnection().get('users').value();
  res.send(users);
}

export const getUser: Handler = (req, res) => {
  const user = getConnection().get('users').find({ id: req.params.id }).value();
  if (!user) {
    return res.status(404).json({ "message": "user was not found" });
  } else {
    res.send(user);
  }
}

export const createUser: Handler = (req, res) => {
  try {
    const validKeys = ['name', 'email', 'id'];
    if (Object.keys(req.body).every(key => validKeys.includes(key))) {
      const { name, email } = req.body;
      const newUser = {
        id: nanoid(),
        name,
        email,
      };
      getConnection().get('users').push(newUser).write();
      res.json(newUser);
    } else {
      res.status(400).json({ "message": "bad request" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

export const updateUser: Handler = (req, res) => {
  const user = getConnection().get('users').find({ id: req.params.id }).value();
  if (!user) {
    return res.status(404).json({ "message": "user doesnt exists" });
  } else {
    const updatedUser = getConnection().get('users').find({ id: req.params.id }).assign(req.body).write();
    res.send(updatedUser);
  }
}

export const deleteUser: Handler = (req, res) => {
  const user = getConnection().get('users').find({ id: req.params.id }).value();
  if (!user) {
    return res.status(404).json({ "message": "user doesnt exists" });
  } else {
    const deletedUser = getConnection().get('users').remove({ id: req.params.id }).write();
    res.send(deletedUser[0]);
  }
}