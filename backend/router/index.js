import express from "express";
import accountController from "../controllers/account.controller.js";

const router = express.Router();
const routes = (app) => {
    router.post("/register", accountController.register);
    router.get("/user-by-email", accountController.getUser);
    router.delete("/delete-user", accountController.deleteUser);
    router.patch("/update-user", accountController.updateUser);
    return app.use("/api", router);
}



export default routes;