import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
} from 'class-validator';

export class CreateChannelDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmptyObject()
  icon: Express.Multer.File;
}
