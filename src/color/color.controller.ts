import { ColorService } from './color.service';
import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { BaseListResponseData } from 'src/utils.common/utils.response.common/utils.base-list-response.common';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { Response } from 'express';
import { Color } from './color.entity/color.entity';
import { ListColorDTO } from './color.dto/color.list.dto';
import { ColorResponse } from './color.response/color.response';
import { CreateColorDTO } from './color.dto/color.create.dto';
import { GetAdminFromToken } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
import { Admin } from 'typeorm';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { ColorStatusEnum } from './color.enum/color.enum';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/color')
export class ColorController {
    constructor(
        private colorService : ColorService
    ){}

    @Get("")
        @UsePipes(new ValidationPipe({ transform: true }))
        async spGetListSupplier(@Query() listColorDTO: ListColorDTO, @Res() res: Response): Promise<any> {
            
            let response: ResponseData = new ResponseData();
            let pagination: Pagination = new Pagination(listColorDTO.page, listColorDTO.limit);
            let color: StoreProcedureResultInterface<Color> = await this.colorService.getListColor(
                listColorDTO.key_search,
                listColorDTO.status,
                pagination
            )
            response.setData(new BaseListResponseData<Color>(new ColorResponse().mapToList(color.data), pagination.limit, color.total_record))
            return res.status(HttpStatus.OK).send(response);
        }

        @Post("/create")
        @UseGuards(AuthGuard())
        @UsePipes(new ValidationPipe({ transform: true }))
        async create(@Body(new ValidationPipe()) createColorDTO: CreateColorDTO, @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
            let response: ResponseData = new ResponseData();
            if(!adminToken){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
            }
           let color : Color = await this.colorService.createColor(createColorDTO);
           response.setData(new ColorResponse(color))
            return res.status(HttpStatus.OK).send(response);
        }

        @Get("/:id/detail")
        @UseGuards(AuthGuard())
        @UsePipes(new ValidationPipe({ transform: true }))
        async getDetail( @Param('id', ParseIntPipe) colorId: number, @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
            let response: ResponseData = new ResponseData();
            if(!adminToken){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
            }
           let color : Color = await this.colorService.findOneById(colorId);
           if(!color){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Nhà cung cấp không tồn tại !`), HttpStatus.OK);
           }
           response.setData(new ColorResponse(color))
            return res.status(HttpStatus.OK).send(response);
        }

        @Post("/:id/change-status")
        @UseGuards(AuthGuard())
        @UsePipes(new ValidationPipe({ transform: true }))
        async changeStatus(@Param('id', ParseIntPipe) colorId: number, @GetAdminFromToken() adminToken: Admin, @Res() res: Response){
            let response: ResponseData = new ResponseData();
            if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Nhà cung cấp không tồn tại !`), HttpStatus.OK);
            }
           let color : Color = await this.colorService.findOneById(colorId);
           if(color.status == 0){
            color.status = ColorStatusEnum.AVAILABLE
            await this.colorService.update(color)
           }else{
            color.status = ColorStatusEnum.UN_AVAILABLE
            await this.colorService.update(color)
           }
           if(!color){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Nhà cung cấp không tồn tại !`), HttpStatus.OK);
           }
           response.setData(new ColorResponse(color))
            return res.status(HttpStatus.OK).send(response);
        }
}
