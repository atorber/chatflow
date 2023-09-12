// controllers/userController.ts

import type { Context } from 'koa'
import { UserChat } from '../services/userService.js'

export class UserController {

  private userService: UserChat

  constructor () {
    this.userService = new UserChat()
  }

  public addUser = async (ctx: Context): Promise<void> => {
    const { id, name }: { id: number, name: string } = ctx.request.body as any
    const user = { id, name }
    this.userService.addUser(user)
    ctx.status = 201
    ctx.body = { message: 'User added successfully' }
  }

  public getUserById = async (ctx: Context): Promise<void> => {
    const id = parseInt(ctx['params'].id)
    const user = this.userService.getUserById(id)
    if (user) {
      ctx.body = user
    } else {
      ctx.status = 404
      ctx.body = { message: 'User not found' }
    }
  }

  public getUsers = async (ctx: Context): Promise<void> => {
    const users = this.userService.getUsers()
    ctx.body = users
  }

}
