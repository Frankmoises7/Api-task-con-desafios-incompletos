import { Request, Response } from "express"
import UserRepository from "../models/repositories/UserRepository"
import { UpdateUserDTO, CreateUserDTO } from "../models/dto/UserDTO"
import { UserTokenPayload } from "../models/dto/UserDTO"
import { updateUserSchema, createUserSchema } from "../models/validators/userSchema"
import bcrypt from 'bcryptjs'
import TaskRepository from "../models/repositories/TaskRepository"




export default class UserController {
  public readonly findAll = async(_req: Request, res: Response) => {
    try{
      const repository = new UserRepository()
      const users = await repository.findAll()
      res.json(users)
    } catch (error) {
      console.log(error.message)
      res.status(500).json({message: 'Something went wrong'})
    }
  }


  public readonly findById = async(req: Request, res: Response) => {
    const { id } = req.params

    try{
      const repository = new UserRepository()
      const userId = await repository.findById(parseInt(id))

      if (!userId) {
        res.status(400).json({ message: 'User not found' })
        return
      }
      res.json({userId})
    } catch (error) {
      console.log(error.message)
      res.status(500).json({message: 'Something went wrong'})
    }
  }

  public readonly getAllTaskByUser = async(req: Request, res: Response) => {
    const { id } = req.params
    try{
      const repository = new TaskRepository(parseInt(id))
      const task = await repository.findAll()
      res.json(task)
    } catch (error) {
      console.log(error.message)
      res.status(500).json({message: 'Something went wrong'})
    }
  }

  public readonly create = async(req: Request, res: Response) => {
    const user: CreateUserDTO = req.body
    try {
      await createUserSchema.validateAsync(user)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }

    const userAdmin = req.user as UserTokenPayload
    const repository = new UserRepository()

    const hashedPassword = bcrypt.hashSync(user.password, 10)

    if (userAdmin.admin === true){
      try {
        const newUser = await repository.create({ ...user, password: hashedPassword})
        res.status(201).json({message: "New user created", newUser})
      } catch (error) {
        if (error.code === 'P2002') {
          res.status(409).json({ message: 'User already exist' })
          return
        }
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
        return
      }
    } else {
      res.status(403).json({ message: 'You dont have permissions'})
        return
    }
  }



  public readonly update = async (req: Request, res: Response) => {
    const user = req.body as UpdateUserDTO
    const { id } = req.params

    const repository = new UserRepository()
    
    try {
      await updateUserSchema.validateAsync(user)
    } catch (error) {
      res.status(400).json({ error: error.message})
      return
    }
    
    const userAdmin = req.user as UserTokenPayload
    const userFromDb = await repository.findById(parseInt(id))

    try {
      if (!userFromDb) {
        res.status(400).json({ message: 'User not found'})
        return
      }

      if (userAdmin.admin === true || userAdmin.sub === userFromDb.id){
      await repository.update(parseInt(id), user)
      res.status(202).json({ mesesage: 'User update', user})
      return user
      } else {
        res.status(403).json({ message: 'You dont have permissions'})
        return
      }

    } catch (error) {
      if (error.code === 'P2002') {
        res.status(409).json({ message: 'User already exists' })
        return
      }
      console.log(error)
      res.status(500).json({ message: 'Somenthing went wrong'})
      return
    }
  }


  public readonly delete = async(req: Request, res: Response) => {
    const { id } = req.params

    const userAdmin = req.user as UserTokenPayload
    const repository = new UserRepository()

    try {
      const userFromDb = await repository.findById(parseInt(id))

      if (!userFromDb) {
        res.status(404).json({ message: 'Task not found'})
      }

      if (userAdmin.admin === true ){
        await repository.delete(parseInt(id))
        res.status(202).json({ mesesage: "user eliminated", id})
        } else {
          res.status(403).json({ message: 'You dont have permissions'})
          return
        }
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
  }

}