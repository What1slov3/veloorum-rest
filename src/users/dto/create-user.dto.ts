import {IsEmail, IsString, IsNotEmpty, Length} from 'class-validator';

class CreateUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 32)
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export default CreateUserDTO;