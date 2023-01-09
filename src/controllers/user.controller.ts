import { Handler } from 'express';
import { nanoid } from 'nanoid';
import { isUserAllowed } from '../auth';
import { getConnection } from '../database/database';
import { RegularUser } from '../models/regularUser';
import { UserDB } from '../models/userDB';
import { UserService } from '../services/userService';


export const getUsers: Handler = async (req, res) => {
  const adminPermissionRequired = true
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth)
    return res.status(404).json({"message": "wronge token"});
    const userService = UserService.getInstance();
    const userData = userService.getall();
  res.send(userData);
}

export const getUser: Handler = async (req, res) => {
  const adminPermissionRequired = true
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth)
    return res.status(404).json({"message": "wronge token"});
    const userService = UserService.getInstance();
    let user = userService.getById(req.params.id);
  if (!user) {
    return res.status(404).json({ "message": "user was not found" });
  } else {
    res.send(user);
  }
}

// export const promoteUser: Handler = async (req, res) => {
//   const auth = await isUserAllowed(req.headers.authorization, true);
//   if(!auth)
//     return res.status(404).json({"message": "wronge token"});
//   let user = getConnection().get('users').find({ id: req.params.id }).value();
//   if (!user) {
//     return res.status(404).json({ "message": "user was not found" });
//   } else {
//     const updatedUser = getConnection().get('users').find({ id: req.params.id }).assign(
//       {...user, isAdmin: true}
//     ).write();
//     res.send(updatedUser.user);
//   }
// }

// export const demoteUser: Handler = async (req, res) => {
//     // actor need to be admin
//     const adminPermissionRequired = true
//     const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
//     if(!auth)
//       return res.status(404).json({"message": "wronge token"});
//     let user = getConnection().get('users').find({ id: req.params.id }).value();
//     if (!user) {
//       return res.status(404).json({ "message": "user was not found" });
//     } else {
//       const updatedUser = getConnection().get('users').find({ id: req.params.id }).assign(
//         {...user, isAdmin: false}
//       ).write();
//       res.send(updatedUser.user);
//     }
//   }

export const createUser: Handler = (req, res) => {
  try {
    const userService = UserService.getInstance();
    if(!userService.checkDataValid(req.body)){
      res.status(400).json({ "message": "bad request" });
      return;
    };
    if(userService.checkDataExist(req.body.name)){
      res.status(404).json({ "message": "user name already exists!" });
      return;
    };
    res.json(userService.create(req.body));
  } catch (error) {
    res.status(500).send(error);
  }
}

export const updateUser: Handler = async (req, res) => {
  const adminPermissionRequired = false
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth)
    return res.status(404).json({"message": "wronge token"});
  
  const userService = UserService.getInstance();
  const user = userService.getById(req.params.id);
  if (!user) {
    return res.status(404).json({ "message": "user doesnt exists" });
  } else {
    const updatedUser = userService.update(req.params.id, req.body);
    res.send(updatedUser);
  }
}

export const deleteUser: Handler = async (req, res) => {
  const adminPermissionRequired = true
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth){
    return res.status(404).json({"message": "wronge token"});
  }
  const userService = UserService.getInstance();
  const user = userService.getById(req.params.id);
  if (!user) {
    return res.status(404).json({ "message": "user doesnt exists" });
  } else {
    const deletedUser = userService.delete(req.params.id);
    res.send(deletedUser);
  }
}

