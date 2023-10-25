import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { BaseListResponseData } from 'src/utils.common/utils.response.common/utils.base-list-response.common';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { ProductService } from './product.service';
import { Response } from 'express';
import { ProductDTO } from './product.dto/product.list.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetAdminFromToken, GetUserFromToken } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
import { User } from 'src/users/users.entity/users.entity';
import { CreateProductDTO } from './product.dto/create.product.dto';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { Product } from './product.entity/product.entity';
import { ProductResponse } from './product.response/product.response';
import { UpdateProductDTO } from './product.dto/update.product.dto';
import { ProductListDetailModel } from './product.entity/product.list.detail.entity';
import { ProductListDataResponse } from './product.response/product.list.data.response';
import { ProductDetailDTO } from './product.dto/product.detail.dto';
import { ProductDetailByIdDataModel } from './product.entity/product.by.id.entity';
import { ProductDetailDataResponse } from './product.response/product.detail.response';
import { Admin } from 'src/admin/admin.entity/admin.entity';
import { CreateProductDetailDTO } from './product.dto/create.product.detail.dto';
import { ProductStatusEnum } from './product.enum/product.status.enum';

@Controller('api/product')
export class ProductController {

    constructor( 
        private productService : ProductService
        ){}

    @Get("")
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetListSalePostsV2(@Query() productDTO: ProductDTO, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        let pagination: Pagination = new Pagination(productDTO.page, productDTO.limit);
        
        let productListDetailModel: StoreProcedureResultInterface<ProductListDetailModel> = await this.productService.getListProduct(productDTO.supplier_id,
            productDTO.category_id,
            productDTO.key_search,
            productDTO.status,
            productDTO.sort,
            pagination);
            
        response.setData(new BaseListResponseData<ProductListDetailModel>(new ProductListDataResponse().mapToList(productListDetailModel.data), pagination.limit, productListDetailModel.total_record, 0))
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @UsePipes(new ValidationPipe({ transform: true }))
    async spProductById(@Param('id', ParseIntPipe) productId: number, @Query() productDetailDTO: ProductDetailDTO, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        let pagination: Pagination = new Pagination(productDetailDTO.page, productDetailDTO.limit);
        let product : Product = await this.productService.findOneById(productId)
        if(!product){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Sản phẩm không tồn tại!`), HttpStatus.OK);
        }else{
            response.setData(new ProductResponse(product));
            return res.status(HttpStatus.OK).send(response);
        }
       
    }

    @Get("/:id/detail")
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetDetailProduct(@Param('id', ParseIntPipe) productId: number, @Query() productDetailDTO: ProductDetailDTO, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        let pagination: Pagination = new Pagination(productDetailDTO.page, productDetailDTO.limit);
        let productDetailByIdDataModel: StoreProcedureResultInterface<ProductDetailByIdDataModel> = await this.productService.getDetailProduct(productId,
            pagination);
            
        response.setData(new BaseListResponseData<ProductDetailByIdDataModel>(new ProductDetailDataResponse().mapToList(productDetailByIdDataModel.data), pagination.limit, productDetailByIdDataModel.total_record, 0))
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/create")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body(new ValidationPipe()) createProductDTO: CreateProductDTO,  @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let product : Product = await this.productService.createProduct(createProductDTO);
        if(!product){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Sản phẩm không tồn tại!`), HttpStatus.OK);
        }else{
            response.setData(new ProductResponse(product));
            return res.status(HttpStatus.OK).send(response);
        }
    }

    @Post("/:id/create-detail")
    @UseGuards(AuthGuard())
    @UsePipes()
    async createProductDetailSizeColor(@Param('id', ParseIntPipe) product_id : number,@Body(new ValidationPipe()) createProductDetailDTO: CreateProductDetailDTO,  @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let productId : Product = await this.productService.findOneById(product_id)
        
        if(!productId){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Sản phẩm không tồn tại !`), HttpStatus.OK);
        }else{
            let product : Product = await this.productService.createProductDetail(product_id,createProductDetailDTO);
            
            if(!product){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Tạo thất bại !`), HttpStatus.OK);
            }
            else{
                let pagination: Pagination = new Pagination(1,20);
                let productDetailByIdDataModel: StoreProcedureResultInterface<ProductDetailByIdDataModel> = await this.productService.getDetailProduct(product_id,
                pagination);
                
                response.setData(new BaseListResponseData<ProductDetailByIdDataModel>(new ProductDetailDataResponse().mapToList(productDetailByIdDataModel.data), pagination.limit, productDetailByIdDataModel.total_record, 0))
                return res.status(HttpStatus.OK).send(response);
            }
        }
    }

    @Post("/:id/update")
    @UseGuards(AuthGuard())
    @UsePipes()
    async update( @Param('id', ParseIntPipe) product_id: number, @Body(new ValidationPipe()) updateProductDTO: UpdateProductDTO , @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let productId : Product = await this.productService.findOneById(product_id)
        if(!productId){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Sản phẩm không tồn tại !`), HttpStatus.OK);
        }
       let product : Product = await this.productService.updateProduct(product_id ,updateProductDTO);
       response.setData(new ProductResponse(product))
        return res.status(HttpStatus.OK).send(response);
    }


    @Post("/:id/change-status")
    @UseGuards(AuthGuard())
    @UsePipes()
    async changeStatusProduct( @Param('id', ParseIntPipe) product_id: number , @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let productId : Product = await this.productService.findOneById(product_id)
        if(!productId){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Sản phẩm không tồn tại !`), HttpStatus.OK);
        }
        if(productId.status == ProductStatusEnum.AVAILABLE){
            productId.status = ProductStatusEnum.UN_AVAILABLE
            await this.productService.update(productId)
        }else{
            productId.status = ProductStatusEnum.AVAILABLE
            await this.productService.update(productId)
        }
       response.setData(new ProductResponse(productId))
        return res.status(HttpStatus.OK).send(response);
    }

}
