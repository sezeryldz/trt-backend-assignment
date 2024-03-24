export interface CreateUserDto {
  id: string;
  email: string;
  password: string;
  updatedAt?: string;
  createdAt?: string;
  accessToken?: string;
}
