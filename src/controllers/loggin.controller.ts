import { Handler } from 'express';
import { getConnection } from '../database';

require("dotenv").config();

export const loggin: Handler = (req, res) => {
  try {
    const jwt = require('jsonwebtoken');
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
        const jwt_secret = process.env.JWT_SECRET;
        const token = jwt.sign({id}, jwt_secret);
        // token = "token" 
        res.json(token); 
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
