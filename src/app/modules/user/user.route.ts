import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/ValidateRequest";
import { checkAuth } from "../../middleware/CheckAuth";
import { Role } from "./user.interface";



const router = Router()



router.post("/register", validateRequest(createZodSchema), UserControllers.createUser)
router.get("/all-users", checkAuth(Role.ADMIN,Role.SUPER_ADMIN) , UserControllers.getAllUsers)
router.patch("/:id",validateRequest(updateUserZodSchema),checkAuth(...Object.values(Role)),UserControllers.updateUser)

export const UserRoutes = router