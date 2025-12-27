import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export enum UserRole {
  STAFF = 'Staff',
  LEADER = 'Leader',
  ADMIN_LOGISTIK = 'Admin Logistik',
  ADMIN_PURCHASE = 'Admin Purchase',
  SUPER_ADMIN = 'Super Admin',
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  divisionId?: string;
}

