const jwt = require('jsonwebtoken');
import { getConnection } from './database/database';

const dotenv = require("dotenv");
dotenv.config();
/**
 * check if it's auth
 * @param token 
 * @returns 
 */
export const isAuth = (token: any) => {
    if(token){
        return true;
    } else {
        return false;
    }
}
/**
 * check Admin permissions
 * @param token 
 */

/**
 * check if it's empty or not utility
 * @param messyToken the entire token
 * @returns true if empty and false if not empty
 */
const __isEmpty = (messyToken: any) => {
    if(messyToken){
        return false;
    } else {
        return true;
    }
}
/**
 * gets the token without the header
 * @param messyToken 
 * @returns token without header start
 */
export const getToken: any = (messyToken: any) => {
    if(isAuth(messyToken)){
        if(__isEmpty(messyToken)){
            return false;
        }
        const split_token = messyToken?.split(" ");
        if(split_token[0] != 'Bearer')
        return split_token[0];
        else if(split_token[0] == 'Bearer')
        return split_token[1];
        else
        return false;
    }
    return false;
}

export const getAuthItems = async (token: any) => {
    if(token = getToken(token)){
        const validKeys = ['id' ,'name', 'isAdmin', 'iat'];
        
        let jwtSecret = process.env.JWT_SECRET;
        return await jwt.verify(token, jwtSecret, (err: any, data: any) =>{
            if(err){
                return false;
            } else if(Object.keys(data).every(key => validKeys.includes(key))){ 
                const items = data;
                let user = getConnection().get('users').find({ id: data.id, isAdmin: data.isAdmin }).value(); // will get the user
                if (!user) { //if user not exists unauthorized user
                    return false;
                }
                return items;
            }
            return false;
        })
    }    
}

export const isAdminAuth = async (token: any) => {
    let adminPer;
    adminPer = await getAuthItems(token);
    if(!adminPer){
        return false;
    }
    return adminPer['isAdmin'];
}

export const isUserAllowed = async (token: any, isAdminRequire: boolean=false) =>{
    if(isAdminRequire)
        return await isAdminAuth(token);
    return await getAuthItems(token);
}

