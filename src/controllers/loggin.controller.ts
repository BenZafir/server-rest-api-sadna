import { Handler } from 'express';
import { getConnection } from '../database';


export const loggin: Handler = (req, res) => {
  try {
    const validKeys = ['userName', 'password'];
    if (Object.keys(req.body).every(key => validKeys.includes(key))) {
      const { userName, password } = req.body;

      let user = getConnection().get('users').find({ name: req.body.userName }).value();
      if (!user) {
        res.status(401).json({ "message": "bad username or password" });
        return;
      }
      if (user.password == req.body.password) {
        let token = "token"
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
