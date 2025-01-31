import { resolve } from "styled-jsx/css"

export const getSession = async () => {
    await new Promise((resolve)=>setTimeout(resolve, 1000));
    return {
        username: "asep",
        email: "admin@gmail.com",
        role: "admin"
    };
};