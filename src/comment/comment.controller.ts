import { CommentService } from './comment.service';
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
import { CommentListDTO } from './comment.dto/comment.list.dto';
import { CommentDataModel } from './comment.entity/comment.list.data.model';
import { CommentResponse } from './comment.response/comment.response';
import { CreateCommentDTO } from './comment.dto/comment.create.dto';
import { Admin } from 'src/admin/admin.entity/admin.entity';
import { Comments } from './comment.entity/conmment.entity';
import { OrderDetailService } from 'src/order-detail/order-detail.service';
import { OrderDetail } from 'src/orders/orders.entity/oders.detail.entity';
import { Product } from 'src/product/product.entity/product.entity';
import { CommentStatusEnum } from './comment.enum/conmment.status.enum';

@Controller('/api/comment')
export class CommentController {
    constructor(
        private commentService : CommentService,
        private orderDetailService : OrderDetailService
    ){}

    @Get("")
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetListComment(@Query() commentListDTO: CommentListDTO, @Res() res: Response): Promise<any> {
        
        let response: ResponseData = new ResponseData();
        let pagination: Pagination = new Pagination(commentListDTO.page, commentListDTO.limit);
        let comment : StoreProcedureResultInterface<CommentDataModel> = await this.commentService.getListComment(
            commentListDTO.product_id,
            commentListDTO.status,
            pagination
        )
        response.setData(new BaseListResponseData<CommentDataModel>(new CommentResponse().mapToList(comment.data), pagination.limit, comment.total_record))
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/create")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body(new ValidationPipe()) createCommentDTO: CreateCommentDTO,  @GetUserFromToken() user: User, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!user){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Người dùng không hợp lệ !`), HttpStatus.OK);
        }
       
        let countComment : number = await this.commentService.spCountCommentByProductId(user.id , createCommentDTO.product_id);
        if(countComment == 0){
            if(createCommentDTO.star_rating > 5 || createCommentDTO.star_rating < 1){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Số sao đánh giá nằm trong khoảng từ 1 - 5 !`), HttpStatus.OK);
            }
            let count : number  = await this.orderDetailService.getOrderDetailCountByUserAndProductId(user.id,createCommentDTO.product_id);
            if(count <= 0){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Vui lòng mua sản phẩm trước khi bình luận !`), HttpStatus.OK);
            }
        }else{
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Mỗi người chỉ được bình luận 1 lần mỗi sản phẩm !`), HttpStatus.OK);
        }
        let comment : CommentDataModel = await this.commentService.createComment(user.id ,createCommentDTO);      
        if(!comment){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không tạo được bình luận , vui lòng thử lại !`), HttpStatus.OK);
        }else{
            response.setData(new CommentResponse(comment));
            return res.status(HttpStatus.OK).send(response);
        }
    }

    @Post("/:id/delete")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async deleteCommentByAdmin(@Param('id', ParseIntPipe) comment_id : number,  @GetAdminFromToken() admin: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!admin){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let comment : Comments = await this.commentService.deleteCommentByAdmin(comment_id);  
            return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/accept-comment")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async acceptCommentByAdmin(@Param('id', ParseIntPipe) comment_id : number,  @GetAdminFromToken() admin: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!admin){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let comment : Comments = await this.commentService.findOneById(comment_id);
        if(comment.status == 1){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Bình luận này đã được duyệt rồi !`), HttpStatus.OK);
        }
        comment.status = CommentStatusEnum.ACCEPT;
        await this.commentService.update(comment);
        let commentDetail : CommentDataModel = await this.commentService.getDetailComment(comment_id);  
        
        response.setData(new CommentResponse(commentDetail));
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id/detail")
    @UsePipes(new ValidationPipe({ transform: true }))
    async getDetailComment(@Param('id', ParseIntPipe) comment_id : number,  @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        let commentId : Comments = await this.commentService.findOneById(comment_id)
        if(!commentId){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Bình luận không tồn tại !`), HttpStatus.OK);
        }
        let comment : CommentDataModel = await this.commentService.getDetailComment(comment_id);  
        
        response.setData(new CommentResponse(comment));
        return res.status(HttpStatus.OK).send(response);
    }
}
