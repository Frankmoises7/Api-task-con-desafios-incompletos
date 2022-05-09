import { Request, Response } from "express"
import type { CreateTaskDTO, UpdateTaskDTO } from "../models/dto/TaskDTO"
import { UserTokenPayload } from "../models/dto/UserDTO"
import TaskRepository from "../models/repositories/TaskRepository"
import { createTaskSchema, updateTaskSchema } from "../models/validators/taskSchema"


export default class TaskController {
  public readonly getAll = async (req: Request, res: Response) => {
    try {

      const user = req.user as UserTokenPayload
      const repository = new TaskRepository(user.sub)
      const task = await repository.findAll()
      const done = req.query.done

      if (done === "1" || done === "0") {
        if (done === "1") {
          task.forEach(element => {
            if (element.done === true) {
              console.log(element)
            } res.json( )
          }) 
        } 

        if (done === '0') {
          task.forEach(element => {
            if (element.done === false) {
              console.log(element)
            } res.json( )
          })
        } 

      } else {
        res.json(task)
      }

    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: 'Something went wrong' })
    }
  }

  public readonly getByDone = async (req: Request, res: Response) => {
    try {
      const user = req.user as UserTokenPayload
      const repository = new TaskRepository(user.sub)
      const task = await repository.findAll()

      res.json({ task })
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: 'Something went wrong' })
    }
  }


  public readonly getById = async (req: Request, res: Response) => {
    const { id } = req.params


    const user = req.user as UserTokenPayload
    const repository = new TaskRepository(user.sub)
    const task = await repository.findById(parseInt(id))

    if (!task) {
      res.status(400).json({ message: 'Task not found' })
      return
    }

    if (task.userId !== user.sub && user.admin === false) {
      res.status(403).json({ message: ' You dont have permissions' })
      return
    }

    res.json(task)


  }

  public readonly create = async (req: Request, res: Response) => {
    const task: CreateTaskDTO = req.body
    try {
      await createTaskSchema.validateAsync(task)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }

    const user = req.user as UserTokenPayload
    const repository = new TaskRepository(user.sub)
    try {
      const newTask = await repository.create(task)
      res.status(201).json(newTask)
    } catch (error) {
      if (error.code === 'P2002') {
        res.status(409).json({ message: 'Task already exist' })
        return
      }
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
      return
    }
  }

  public readonly update = async (req: Request, res: Response) => {
    const { id } = req.params
    const task: UpdateTaskDTO = req.body

    try {
      await updateTaskSchema.validateAsync(task)
    } catch (error) {
      res.status(400).json({ message: error.message })
      return
    }

    const user = req.user as UserTokenPayload
    const repository = new TaskRepository(user.sub)

    try {
      const taskFromDb = await repository.findById(parseInt(id))

      if (!taskFromDb) {
        res.status(400).json({ message: 'Task not found' })
        return
      }

      if (taskFromDb.userId !== user.sub && user.admin === false) {
        res.status(403).json({ message: 'You dont have permissions' })
        return
      }
      await repository.update(parseInt(id), task)
      res.status(202).json({ mesesage: 'Task update', task })
      return task

    } catch (error) {
      if (error.code === 'P2002') {
        res.status(409).json({ message: 'Task already exists' })
        return
      }
      console.log(error)
      res.status(500).json({ message: 'Somenthing went wronf' })
      return
    }
  }

  public readonly delete = async (req: Request, res: Response) => {
    const { id } = req.params

    const user = req.user as UserTokenPayload
    const repository = new TaskRepository(user.sub)

    try {
      const taskFromDb = await repository.findById(parseInt(id))

      if (!taskFromDb) {
        res.status(404).json({ message: 'Task not found' })
        return
      }

      if (user.admin === true || taskFromDb?.userId === user.sub) {
        await repository.delete(parseInt(id))
        res.status(202).json({ message: 'Task elimited' })
        return
      } else {
        res.status(403).json({ message: 'You dont have permissions' })
        return
      }

    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
}