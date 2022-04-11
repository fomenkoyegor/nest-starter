import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkDto } from './dto/bookmark.dto';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {

  constructor(
   private bookmarkService: BookmarkService,
  ) {}

  @Get()
  getBookmarks(@GetUser('id') userId: number) {
   return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  getBookmarkById(@GetUser('id') userId: number,@Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @Delete(':id')
  deleteBookmarkById(@GetUser('id') userId: number,@Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookmarkService.deleteBookmarkById(userId,bookmarkId);
  }

  @Post()
  createBookmark(@GetUser('id') userId: number,@Body() dto: BookmarkDto) {
    return this.bookmarkService.createBookmark(userId,dto);
  }

  @Patch(':id')
  editBookmarkById(@GetUser('id') userId: number,@Param('id', ParseIntPipe) bookmarkId: number,@Body() dto:BookmarkDto) {
   return this.bookmarkService.editBookmarkById(userId,bookmarkId,dto);
  }

}
