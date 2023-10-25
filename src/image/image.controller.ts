
import { ImageService } from './image.service';
import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { BaseListResponseData } from 'src/utils.common/utils.response.common/utils.base-list-response.common';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetAdminFromToken, GetUserFromToken } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
import { User } from 'src/users/users.entity/users.entity';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { Admin } from 'src/admin/admin.entity/admin.entity';
import { ListImageDTO } from './image.dto/list.image.dto';
import { Images } from './image.entity/image.entity';
import { ImageResponse } from './image.response/image.response';
import { CreateImageDTO } from './image.dto/create.image.dto';

@Controller('api/image')
export class ImageController {
    constructor( 
        private imageService : ImageService
        ){}


    @Get("")
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetListImages(@Query() listImageDTO: ListImageDTO, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        let pagination: Pagination = new Pagination(listImageDTO.page, listImageDTO.limit);
        
        let image : StoreProcedureResultInterface<Images> = await this.imageService.getListImages(pagination);  
        response.setData(new BaseListResponseData<Images>(new ImageResponse().mapToList(image.data), pagination.limit, image.total_record, 0))
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetDetailImages(@Param('id', ParseIntPipe) imageId: number, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        
        let image : Images = await this.imageService.findOneById(imageId);  
        if(!image){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Không tìm thấy hình ảnh !`), HttpStatus.OK);
        }
        response.setData(new ImageResponse(image));
        return res.status(HttpStatus.OK).send(response);
    }


    @Post("/add")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body(new ValidationPipe()) createImageDTO: CreateImageDTO,  @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let image : Images = await this.imageService.createImage(createImageDTO);
        if(!image){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Không thêm được hình ảnh !`), HttpStatus.OK);
        }else{
            response.setData(new ImageResponse(image));
            return res.status(HttpStatus.OK).send(response);
        }
    }

}
