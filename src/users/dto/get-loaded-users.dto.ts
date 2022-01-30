import {
  IsNotEmpty,
  IsArray,
} from 'class-validator';

class GetLoadedUsersDTO {
  @IsArray()
  @IsNotEmpty()
  usersId: string[];
}

export default GetLoadedUsersDTO;
