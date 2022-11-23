import { Handler } from 'express';
import { nanoid } from 'nanoid';
import { isUserAllowed } from '../auth';
import { getConnection } from '../database';

export const getOrders: Handler = async (req, res) => {
  const adminPermissionRequired = false
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth)
    return res.status(404).json({"message": "wronge token"});
  const orders = getConnection().get('orders').value();
  res.send(orders);
}

export const getOrder: Handler = async (req, res) => {
  const adminPermissionRequired = false
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth)
    return res.status(404).json({"message": "wronge token"});
  const order = getConnection().get('orders').find({ id: req.params.id }).value();
  if (!order) {
    return res.status(404).json({ "message": "order was not found" });
  } else {
    res.send(order);
  }
}

export const createOrder: Handler = async (req, res) => {
  const adminPermissionRequired = false
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth)
    return res.status(404).json({"message": "wronge token"});
  try {
    const validKeys = ['itemsId', 'userId', 'id'];
    if (Object.keys(req.body).every(key => validKeys.includes(key))) {
      const { userId, itemsId} = req.body;
      const userCheck = getConnection().get('users').find({ id: userId }).value();
      if(!userCheck || checkItemToOrder(req.body.itemsId) == false)
      {
        res.status(400).json({ "message": "bad request" });
        return;
      }
      const newOrder = {
        id: nanoid(),
        userId,
        itemsId,
      };
      getConnection().get('orders').push(newOrder).write();
      res.json(newOrder);
    } else {
      res.status(400).json({ "message": "bad request" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

export const updateOrder: Handler = async (req, res) => {
  const adminPermissionRequired = false
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth)
    return res.status(404).json({"message": "wronge token"});
  const order = getConnection().get('orders').find({ id: req.params.id }).value();
  if (!order) {
    return res.status(404).json({ "message": "order doesnt exists" });
  } else {
    const userCheck = getConnection().get('users').find({ id: req.body.userId }).value();
    if(!userCheck || checkItemToOrder(req.body.itemsId) == false)
    {
      res.status(400).json({ "message": "bad request" });
      return;
    }
    const updatedOrder = getConnection().get('orders').find({ id: req.params.id }).assign(req.body).write();
    res.send(updatedOrder);
  }
}

export const deleteOrder: Handler = async (req, res) => {
  const adminPermissionRequired = false
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth)
    return res.status(404).json({"message": "wronge token"});
  const order = getConnection().get('orders').find({ id: req.params.id }).value();
  if (!order) {
    return res.status(404).json({ "message": "order doesnt exists" });
  } else {
    const deletedOrder = getConnection().get('orders').remove({ id: req.params.id }).write();
    res.send(deletedOrder[0]);
  }
}

const checkItemToOrder = (itemsId: string[]):boolean => {
  return itemsId.every(i => getConnection().get('items').find({ id: i }).value() != undefined)
}