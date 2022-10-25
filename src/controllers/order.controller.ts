import { Handler } from 'express';
import { nanoid } from 'nanoid';
import { getConnection } from '../database';

export const getOrders: Handler = (req, res) => {
  const orders = getConnection().get('orders').value();
  res.send(orders);
}

export const getOrder: Handler = (req, res) => {
  const order = getConnection().get('orders').find({ id: req.params.id }).value();
  if (!order) {
    return res.status(404).json({ "message": "order was not found" });
  } else {
    res.send(order);
  }
}

export const createOrder: Handler = (req, res) => {
  try {
    const validKeys = ['itemsId', 'userId', 'id'];
    if (Object.keys(req.body).every(key => validKeys.includes(key))) {
      const { userId, itemsId} = req.body;
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

export const updateOrder: Handler = (req, res) => {
  const order = getConnection().get('orders').find({ id: req.params.id }).value();
  if (!order) {
    return res.status(404).json({ "message": "order doesnt exists" });
  } else {
    const updatedOrder = getConnection().get('orders').find({ id: req.params.id }).assign(req.body).write();
    res.send(updatedOrder);
  }
}

export const deleteOrder: Handler = (req, res) => {
  const order = getConnection().get('orders').find({ id: req.params.id }).value();
  if (!order) {
    return res.status(404).json({ "message": "order doesnt exists" });
  } else {
    const deletedOrder = getConnection().get('orders').remove({ id: req.params.id }).write();
    res.send(deletedOrder[0]);
  }
}