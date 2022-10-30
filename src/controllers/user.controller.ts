import { Handler } from 'express';
import { nanoid } from 'nanoid';
import { getConnection } from '../database';

export const getUsers: Handler = (req, res) => {
  let users = getConnection().get('users').value();
  users.forEach(u => delete u.password)
  res.send(users);
}

export const getUser: Handler = (req, res) => {
  let user = getConnection().get('users').find({ id: req.params.id }).value();
  if (!user) {
    return res.status(404).json({ "message": "user was not found" });
  } else {
    delete user.password;
    res.send(user);
  }
}

export const promoteUser: Handler = (req, res) => {
  // actor need to be admin
  let user = getConnection().get('users').find({ id: req.params.id }).value();
  if (!user) {
    return res.status(404).json({ "message": "user was not found" });
  } else {
    const updatedUser = getConnection().get('users').find({ id: req.params.id }).assign(
      {...user, isAdmin: true}
    ).write();
    delete user.password;
    res.send(updatedUser);
  }
}

export const demoteUser: Handler = (req, res) => {
    // actor need to be admin
    let user = getConnection().get('users').find({ id: req.params.id }).value();
    if (!user) {
      return res.status(404).json({ "message": "user was not found" });
    } else {
      const updatedUser = getConnection().get('users').find({ id: req.params.id }).assign(
        {...user, isAdmin: false}
      ).write();
      delete user.password;
      res.send(updatedUser);
    }
  }

export const createUser: Handler = (req, res) => {
  try {
    const validKeys = ['name', 'email', 'password'];
    if (Object.keys(req.body).every(key => validKeys.includes(key))) {
      const { name, email, password } = req.body;
      let newId = nanoid();
      let user = getConnection().get('users').find({ id: newId }).value();
      while(user)
      {
        newId = nanoid();
        user = getConnection().get('users').find({ id: newId }).value();
      }
      const newUser = {
        id: newId,
        name,
        password: password, // TODO: ash it
        email,
        isAdmin: false,
        ordersId: []
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