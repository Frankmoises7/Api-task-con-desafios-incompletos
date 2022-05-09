/*import { User } from "@prisma/client"
import { UserGitHubDTO } from "../dto/GithubDTO"
import GitHubApiService from "../services/GithubApiService"

export async function mapUserEntityToDto(user: User): Promise<UserGitHubDTO> {
  const gitHubService = new GitHubApiService()
  const data = user.data ? user.data.split(',') : []
  const dataFromService = await Promise.all(
    data.map(async userGH => gitHubService.getByUserGitHub(user.githubAccount))
  )
  return {
    ...data,
    data: dataFromService
  }
}
*/