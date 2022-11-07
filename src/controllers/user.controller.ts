import { Handler } from 'express';
import { nanoid } from 'nanoid';
import { getConnection, UserDB } from '../database';


type UserData = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  ordersId: string[];
}

export const getUsers: Handler = (req, res) => {
  let users = getConnection().get('users').value();
  let userData = users.map(u => convertUserDBToUserData(u))
  res.send(userData);
}

export const getUser: Handler = (req, res) => {
  let user = getConnection().get('users').find({ id: req.params.id }).value();
  if (!user) {
    return res.status(404).json({ "message": "user was not found" });
  } else {
    res.send(convertUserDBToUserData(user));
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
    res.send(convertUserDBToUserData(updatedUser));
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
      res.send(convertUserDBToUserData(updatedUser));
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
      res.json(convertUserDBToUserData(newUser));
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
    res.send(convertUserDBToUserData(updatedUser));
  }
}

export const deleteUser: Handler = (req, res) => {
  const user = getConnection().get('users').find({ id: req.params.id }).value();
  if (!user) {
    return res.status(404).json({ "message": "user doesnt exists" });
  } else {
    const deletedUser = getConnection().get('users').remove({ id: req.params.id }).write();
    res.send(convertUserDBToUserData(deletedUser[0]));
  }
}

const convertUserDBToUserData = (user:UserDB):UserData => {
  return <UserData>{id:user.id,name:user.name, email:user.email, isAdmin:user.isAdmin, ordersId: user.ordersId}
}

