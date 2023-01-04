import { Handler } from 'express';
import { getConnection } from '../database/database';

export const loggin: Handler = (req, res) => {
  try {
    const dotenv = require("dotenv");
    dotenv.config();
    const jwt = require('jsonwebtoken');
    // validate the keys of the json are same as the db desired keys
    const validKeys = ['userName', 'password'];
    if (Object.keys(req.body).every(key => validKeys.includes(key))) {
      const { userName, password } = req.body;
      let user = getConnection().get('users').find({ name: req.body.userName }).value(); // will get the user
      if (!user) { //if user not exists unauthorized user
        res.status(401).json({ "message": "bad username or password" }); 
        return;
      }
      // if the password of the user is equal too we'll generate a token and send it to the user
      // authorization:
      if (user.password == req.body.password) { 
        const id = user.id;
        const adminPermission = user.isAdmin;
        let jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign({id: id,name: user.name, isAdmin: adminPermission}, jwtSecret);
        // token = "token" 
        res.json({
          "token": token,
        }); 
        // res.json({auth: true, token: token}) maybe we'll use this
        return;
      } 
      else{
        res.status(401).json({ "message": "bad username or password" }); 
        return;
      }
    } else {
      res.status(404).json({ "message": "bad request" });
      return;
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
