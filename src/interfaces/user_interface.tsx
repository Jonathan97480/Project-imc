interface UserProfile {
  id: number
  user_name: string
  user_sexe: string
  user_age: number
  user_size: number
  user_poids_start: number
  user_poids_end: number
  user_imc_start: number
  user_imc_end: number
  user_avatar: string | undefined
}

export default UserProfile
