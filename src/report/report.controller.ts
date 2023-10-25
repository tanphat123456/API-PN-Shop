import { OrdersService } from 'src/orders/orders.service';
import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { BaseListResponseData } from 'src/utils.common/utils.response.common/utils.base-list-response.common';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { Response } from 'express';
import { GetAdminFromToken, GetUserFromToken } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
import { User } from 'src/users/users.entity/users.entity';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { AuthGuard } from '@nestjs/passport';
import { Admin } from 'typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { RpOrderTotalAmountDTO } from './report.dto/report.order.total-amount.dto';
import { OrderReportTotalAmountModel } from './report.entity/report.order.total-amount.data.model';
import { RpOrderTotalAmountResponse } from './report.response/report.order.total-amount.response';
import { OrderReportTotalRevenueModel } from './report.entity/report.oder.total-revenue.data.model';
import { RpTotalRevenueDTO } from './report.dto/report.total-revenue.dto';
import { RpOrderTotalRevenueResponse } from './report.response/report.order.total-revenue.response';
import { ProductService } from 'src/product/product.service';
import { RpProductTotalAmountDTO } from './report.dto/report.product.total-amount.dto';
import { ProductReportDataModel } from './report.entity/report.product.list.data.model';
import { RpProductTotalAmountResponse } from './report.response/report.product.total-amount.response';
import { Product } from 'src/product/product.entity/product.entity';
import { ProductDetailReportDataModel } from './report.entity/report.product.detail.data.model';
import { ProductDetailReportResponse } from './report.response/report.product.detail.total-amount.response';
import { CategoryService } from 'src/category/category.service';
import { RpCategoryTotalAmountDTO } from './report.dto/report.category.total-amount.dto';
import { CategoryReportDataModel } from './report.entity/report.category.data.model';
import { CategoryReportTotalAmountResponse } from './report.response/report.category.total-amount.response';

@Controller('/api/report')
export class ReportController {
    constructor( 
        private ordersService : OrdersService,
        private productService : ProductService,
        private categoryService : CategoryService
        ){}

        // Báo cáo số lượng hóa đơn và tổng tiền ( có lọc theo ngày , tháng , năm)
    @Get("/order/total-amount")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetRpTotalAmount(@Query() rpOrderTotalAmountDTO: RpOrderTotalAmountDTO,  @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let report: OrderReportTotalAmountModel = await this.ordersService.getRpOrderTotalAmount(
            rpOrderTotalAmountDTO.from_date,
            rpOrderTotalAmountDTO.to_date
        )
        response.setData(new RpOrderTotalAmountResponse(report))
        return res.status(HttpStatus.OK).send(response);
    }
        // Báo cáo doanh số theo từng sản phẩm ( có lọc theo ngày , tháng , năm)
    @Get("/product/total-amount")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetRpProductTotalAmount(@Query() rpProductTotalAmountDTO: RpProductTotalAmountDTO,  @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let pagination: Pagination = new Pagination(rpProductTotalAmountDTO.page, rpProductTotalAmountDTO.limit);
        
        let report: StoreProcedureResultInterface<ProductReportDataModel> = await this.productService.getRpProductTotalAmount(
            rpProductTotalAmountDTO.from_date,
            rpProductTotalAmountDTO.to_date,
            pagination
        )
        
        response.setData(new BaseListResponseData<ProductReportDataModel>(new RpProductTotalAmountResponse().mapToList(report.data), pagination.limit, report.total_record))
        return res.status(HttpStatus.OK).send(response);
    }


    // Báo cáo doanh số theo danh mục sản phẩm

    @Get("/category/total-amount")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetRpCategoryTotalAmount(@Query() rpCategoryTotalAmountDTO: RpCategoryTotalAmountDTO,  @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let pagination: Pagination = new Pagination(rpCategoryTotalAmountDTO.page, rpCategoryTotalAmountDTO.limit);
        
        let report: StoreProcedureResultInterface<CategoryReportDataModel> = await this.categoryService.getRpCateforyTotalAmount(
            rpCategoryTotalAmountDTO.category_id,
            rpCategoryTotalAmountDTO.from_date,
            rpCategoryTotalAmountDTO.to_date,
            pagination
        )
        
        response.setData(new BaseListResponseData<ProductReportDataModel>(new CategoryReportTotalAmountResponse().mapToList(report.data), pagination.limit, report.total_record))
        return res.status(HttpStatus.OK).send(response);
    }

        // Báo cáo chi tiết sản phẩm 

    @Get("/product/:id/detail")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetRpProductDetailTotalAmount(@Param('id', ParseIntPipe) productId: number,@Query() rpProductTotalAmountDTO: RpProductTotalAmountDTO,  @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let product : Product = await this.productService.findOneById(productId);
        if(!product){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Sản phẩm không tồn tại !`), HttpStatus.OK);
        }else{
            let pagination: Pagination = new Pagination(rpProductTotalAmountDTO.page, rpProductTotalAmountDTO.limit);
        
            let report: StoreProcedureResultInterface<ProductDetailReportDataModel> = await this.productService.getRpProductDetail(
                product.id,
                rpProductTotalAmountDTO.from_date,
                rpProductTotalAmountDTO.to_date,
                pagination
            )
            response.setData(new BaseListResponseData<ProductDetailReportDataModel>(new ProductDetailReportResponse().mapToList(report.data), pagination.limit, report.total_record))
            return res.status(HttpStatus.OK).send(response);
        }
       
    }
        // Báo cáo doanh thu , chi phí , lợi nhuận ( có lọc theo ngày , tháng , năm)
    @Get("/order/total-revenue")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetRpTotalAmountV2(@Query() rpTotalRevenueDTO: RpTotalRevenueDTO, @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let report: OrderReportTotalRevenueModel = await this.ordersService.getRpOrderTotalRevenue(
            rpTotalRevenueDTO.from_date,
            rpTotalRevenueDTO.to_date
        )
        
        response.setData(new RpOrderTotalRevenueResponse(report))
        return res.status(HttpStatus.OK).send(response);
    }
    
}
