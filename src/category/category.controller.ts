import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { BaseListResponseData } from 'src/utils.common/utils.response.common/utils.base-list-response.common';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { CategoryService } from './category.service';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { Response } from 'express';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { CreateCategoryDTO } from './category.dto/create.category.dto';
import { ListCategoryDTO } from './category.dto/list.category.dto';
import { Category } from './category.entity/category.entity';
import { CategoryResponse } from './category.response/category.response';
import { AuthGuard } from '@nestjs/passport';
import { GetAdminFromToken } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
import { Admin } from 'typeorm';
import { CategoryStatusEnum } from './category.enum/category.enum';

@Controller('api/category')
export class CategoryController {
    constructor( 
        private categoryService : CategoryService
        ){}

    @Get("")
    @UsePipes(new ValidationPipe({ transform: true }))
    async getListCategory(@Query() listCategoryDTO: ListCategoryDTO, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        let pagination : Pagination = new Pagination(listCategoryDTO.page,listCategoryDTO.limit);   
        
        let categoryModel : StoreProcedureResultInterface<Category> = await this.categoryService.getListCategory(
            listCategoryDTO.key_search,
            listCategoryDTO.status,
            pagination
        )
        response.setData(new BaseListResponseData<Category>(new CategoryResponse().mapToList(categoryModel.data), pagination.limit, categoryModel.total_record, 0))
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id/detail")
    @UsePipes(new ValidationPipe({ transform: true }))
    async getDetailCategory(@Param('id', ParseIntPipe) categoryId: number, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        let category : Category = await this.categoryService.findOneById(categoryId);
        if(!category){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `id truyền vào không hợp lệ !`), HttpStatus.OK);
        }
        else{
            response.setData(new CategoryResponse(category));
            return res.status(HttpStatus.OK).send(response);
        }
    }

    @Post("/create")
    @UseGuards(AuthGuard())
    @UsePipes()
    async create(@Body(new ValidationPipe()) createCategoryDTO: CreateCategoryDTO,  @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let category : Category = await this.categoryService.createCategory(createCategoryDTO);
        
        response.setData(new CategoryResponse(category))
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/change-status")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async changeStatusCategory(@Param('id', ParseIntPipe) categoryId: number, @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let category : Category = await this.categoryService.findOneById(categoryId);
        if(!category){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `id truyền vào không hợp lệ !`), HttpStatus.OK);
        }
        else{
            if(category.status == CategoryStatusEnum.AVAILABLE){
                category.status = 0
                await this.categoryService.update(category)
            }else{
                category.status = 1
                await this.categoryService.update(category)
            }
            response.setData(new CategoryResponse(category));
            return res.status(HttpStatus.OK).send(response);
        }
    }
}
