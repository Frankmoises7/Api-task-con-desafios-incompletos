//

export interface BaseUserDTO {
  firstName: string
  lastName: string
  email: string
  admin?: boolean
  githubAccount?: string
}

export interface UserDTO extends BaseUserDTO {
  id: number
  
}

export interface CreateUserDTO extends BaseUserDTO {
  password: string
}

export type UpdateUserDTO = Partial<CreateUserDTO>

export interface LoginUserDTO extends UserDTO {
  password: string
}


//export interface UserDTOWhitGH extends UserGitHubDTO {
// data: (UserGitHubDTO | undefined)[]
//}

export interface UserTokenPayload {
  sub:number
  email: string
  iat: number
  exp: number
  admin: boolean
  githubAccount?: string
}