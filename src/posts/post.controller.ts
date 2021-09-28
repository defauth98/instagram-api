import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, Param, Res } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('posts')
export class PostController {
  constructor(private readonly postsService: PostService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: "./uploads",
      filename: (request, file, callback) => {
        const filename = `${Date.now()}-${file.originalname}`

        callback(null, filename)
      }
    })
  }))
  create(@UploadedFile() file: Express.Multer.File, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto, file);
  }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './uploads' });
  }


  @Get()
  findAll() {
    return this.postsService.findAll();
  }
}
