import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { BaseListResponseData } from 'src/utils.common/utils.response.common/utils.base-list-response.common';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { Response } from 'express';
import { SizeService } from './size.service';
import { ListSizeDTO } from './size.dto/size.list.dto';
import { Size } from './size.entity/size.entity';
import { SizeResponse } from './size.response/size.response';
import { CreateSizeDTO } from './size.dto/size.create.dto';
import { GetAdminFromToken } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
import { Admin } from 'typeorm';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { SizeStatusEnum } from './size.enum/size.enum';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/size')
export class SizeController {
    constructor(
        private sizeService : SizeService
    ){}

    @Get("")
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetListSupplier(@Query() listSizeDTO: ListSizeDTO, @Res() res: Response): Promise<any> {
        
        let response: ResponseData = new ResponseData();
        let pagination: Pagination = new Pagination(listSizeDTO.page, listSizeDTO.limit);
        let size: StoreProcedureResultInterface<Size> = await this.sizeService.getListSize(
            listSizeDTO.key_search,
            listSizeDTO.status,
            pagination
        )
        response.setData(new BaseListResponseData<Size>(new SizeResponse().mapToList(size.data), pagination.limit, size.total_record))
        return res.status(HttpStatus.OK).send(response);
    }


    @Post("/create")
    @UseGuards(AuthGuard())
    @UsePipes()
    async create(@Body(new ValidationPipe()) createSizeDTO: CreateSizeDTO, @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let size : Size = await this.sizeService.createSize(createSizeDTO);
        response.setData(new SizeResponse(size))
        return res.status(HttpStatus.OK).send(response);
    }


    @Get("/:id/detail")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async getDetail( @Param('id', ParseIntPipe) sizeId: number, @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let size : Size = await this.sizeService.findOneById(sizeId);
        if(!size){
        throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Size quần áo không tồn tại !`), HttpStatus.OK);
        }
        response.setData(new SizeResponse(size))
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/change-status")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async changeStatus(@Param('id', ParseIntPipe) colorId: number, @GetAdminFromToken() adminToken: Admin, @Res() res: Response){
        let response: ResponseData = new ResponseData();
        if(!adminToken){
        throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập!`), HttpStatus.OK);
        }
        let size : Size = await this.sizeService.findOneById(colorId);
        if(!size){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Size quần áo không tồn tại !`), HttpStatus.OK);
            }
        if(size.status == 0){
            size.status = SizeStatusEnum.AVAILABLE
            await this.sizeService.update(size)
        }else{
            size.status = SizeStatusEnum.UN_AVAILABLE
            await this.sizeService.update(size)
        }
        response.setData(new SizeResponse(size))
        return res.status(HttpStatus.OK).send(response);
    }
}
