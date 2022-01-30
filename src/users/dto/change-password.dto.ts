import { IsString, IsNotEmpty } from 'class-validator';

class ChangePasswordDTO {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export default ChangePasswordDTO;
