import { getUploadedFileUrl } from './../common/getUploadedFileUrl';
import { extname } from 'path/posix';
import { FilesService } from './files.service';
import { isDev } from './../common/isDev';
import { multerOptions } from './../common/configs/storage.config';
import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly FilesService: FilesService) {}

  @Post('/upload')
  @UseInterceptors(FilesInterceptor('files[]', 3, multerOptions))
  uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map((file) => getUploadedFileUrl(file));
  }

  @Get(':fid')
  async getFile(
    @Param('fid') fid: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    res.set({
      'Content-Type': `image/${extname(fid).substr(1)}`,
      'Content-Disposition': 'inline',
      'Cache-Control': 'max-age=31536000'
    });
    return this.FilesService.getFile(fid);
  }
}
