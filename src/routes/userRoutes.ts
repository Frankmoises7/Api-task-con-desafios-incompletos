import { Router } from "express"
import userController from "../controllers/UserControllers"
import tokenValidator from "../middlewares/tokenValidator"

const userRoutes = Router()
const controller = new userController()

userRoutes.get('/', controller.findAll)
userRoutes.get('/:id', controller.findById)
userRoutes.post('/create', tokenValidator({adminOnly: true}), controller.create)
userRoutes.put('/update/:id', tokenValidator(), controller.update)
userRoutes.delete('/delete/:id', tokenValidator({adminOnly: true}), controller.delete)
userRoutes.get('/:id/tasks', tokenValidator(),controller.getAllTaskByUser)


export default userRoutes