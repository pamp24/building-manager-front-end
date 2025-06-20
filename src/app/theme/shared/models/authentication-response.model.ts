import { User } from 'src/app/theme/shared/components/_helpers/user'

export interface AuthenticationResponse {
  token: string;
  user: User;
}