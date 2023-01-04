import { Handler } from 'express';
import { nanoid } from 'nanoid';
import { isUserAllowed } from '../auth';
import { getConnection } from '../database/database';
import { OrderService } from '../services/orderService';
import { UserService } from '../services/userService';
import { Order } from '../models/order';

export const getOrders: Handler = async (req, res) => {
  const adminPermissionRequired = false
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth){
    return res.status(404).json({"message": "wronge token"});
  }
  const orderService = OrderService.getInstance();
  const orders = orderService.getall();
  res.send(orders);
}

export const getOrder: Handler = async (req, res) => {
  const adminPermissionRequired = false
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth){
    return res.status(404).json({"message": "wronge token"});
  }
  const orderService = OrderService.getInstance();
  const order = orderService.getById(req.params.id);
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
    let userId = auth.id
    const orderService = OrderService.getInstance();
    if(!orderService.checkDataValid(req.body)){
      res.status(400).json({ "message": "bad request" });
      return;
    };
    const newOrder = orderService.create({...req.body,userId});
    res.json(newOrder);

  } catch (error) {
    res.status(500).send(error);
  }
}

export const updateOrder: Handler = async (req, res) => {
  const adminPermissionRequired = false
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth){
    return res.status(404).json({"message": "wronge token"});
  }
  const orderService = OrderService.getInstance();
  const userService = UserService.getInstance();
  const order = (orderService.getById(req.params.id) as Order);
  if (!order) {
    return res.status(404).json({ "message": "order doesnt exists" });
  } else {
    const userCheck = userService.getById(req.body.userId);
    if(!userCheck || orderService.checkItemToOrder(req.body.itemsId) == false)
    {
      res.status(400).json({ "message": "bad request" });
      return;
    }
    const updatedOrder = orderService.update(req.params.id, req.body);
    res.send(updatedOrder);
  }
}

export const deleteOrder: Handler = async (req, res) => {
  const adminPermissionRequired = false
  const auth = await isUserAllowed(req.headers.authorization, adminPermissionRequired);
  if(!auth){
    return res.status(404).json({"message": "wronge token"});
  }
  const orderService = OrderService.getInstance();
  const order = orderService.getById(req.params.id);
  if (!order) {
    return res.status(404).json({ "message": "order doesnt exists" });
  } else {
    const deletedOrder = orderService.delete(req.params.id);
    res.send(deletedOrder);
  }
}

