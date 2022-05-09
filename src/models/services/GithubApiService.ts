/*import axios from "axios"
import { Request, Response } from "express"
import { UserTokenPayload } from "../dto/UserDTO"


export default function getInformation() {
  return async (req: Request, res: Response) => {
    const user = req.user as UserTokenPayload
    const response = await axios.get('https://api.github.com/users/', {
      params: {
        user: user.githubAccount
      }
    })
    res.status(200).json(response)
    console.log(response)
    return response
  }

*/

/*
import axios from 'axios'
import { UserGitHubDTO } from '../dto/GithubDTO'

const baseUrl = 'https://api.github.com/users/'

export default class GitHubApiService {
  async getByUserGitHub(githubAccount: string): Promise<UserGitHubDTO | undefined> {
    try {
      const response = await axios.get(`${baseUrl}/${githubAccount}`)
      const { id, name, repos_url, html_url, username } = response.data
      const userGitHubDto: UserGitHubDTO = {
        id: id.map((item:any) => item.name.name).join(', '),
        name: name.map((item:any) => item.name.name).join(', '),
        repos_url: repos_url.map((item:any) => item.repos_url.repos_url).join(', '),
        html_url: html_url.map((item:any) => item.html_url.html_url).join(', '),
        username: username.map((item:any) => item.username.username).join(', ')
      }
      return userGitHubDto
    } catch {
      console.log('Api Git Service not available')
      return
    }
  }
}
*/
