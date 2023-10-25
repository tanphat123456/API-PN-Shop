import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection,Repository } from 'typeorm';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { ExceptionStoreProcedure } from 'src/utils.common/utils.exceptions.common/utils.store-procedure-exception.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { StoreProcedureResult } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.common';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { Comments } from './comment.entity/conmment.entity';
import { CreateCommentDTO } from './comment.dto/comment.create.dto';
import { CommentDataModel } from './comment.entity/comment.list.data.model';
import { CommentListDTO } from './comment.dto/comment.list.dto';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(Comments)
        private commentRepository: Repository<Comments>,
    ){}

    async createComment(user_id : number ,createCommentDTO : CreateCommentDTO) :  Promise<CommentDataModel>{
        let result = await this.commentRepository.query('CALL sp_create_comment(?,?,?,?,@status,@message); SELECT @status AS status, @message AS message',
        [
            createCommentDTO.product_id,
            user_id,
            createCommentDTO.star_rating,
            createCommentDTO.user_comment
        ]);
        ExceptionStoreProcedure.validate(result);
        let data : CommentDataModel = new StoreProcedureResult<CommentDataModel>().getResultDetail(result);
        return data;
    }

    async getListComment( product_id : number , status : number , pagination : Pagination) :  Promise<StoreProcedureResultInterface<CommentDataModel>>{
        let result = await this.commentRepository.query('CALL sp_get_list_comment(?,?,?,?,@status,@message,@totalRecord); SELECT @status AS status, @message AS message, @totalRecord AS total_record',
        [
            product_id,
            status,
            pagination.getLimit(),
            pagination.getOffset()
        ]);
        ExceptionStoreProcedure.validate(result);
        let data: StoreProcedureResultInterface<CommentDataModel> = new StoreProcedureResult<CommentDataModel>().getResultPagination(result)
        return data;
    }


    async getDetailComment( comment_id : number) :  Promise<CommentDataModel>{
        let result = await this.commentRepository.query('CALL sp_get_detail_comment(?,@status,@message); SELECT @status AS status, @message AS message',
        [
            comment_id,
        ]);
        ExceptionStoreProcedure.validate(result);
        result = new StoreProcedureResult<CommentDataModel>().getResultDetail(result);
        return result;
    }


    async deleteCommentByAdmin(comment_id : number) : Promise<Comments>{
        let result = await this.commentRepository.query('CALL sp_delete_comment_by_admin(?,@status,@message); SELECT @status AS status, @message AS message',[
            comment_id
        ])
        ExceptionStoreProcedure.validate(result);
        return result;
    }


    async findOneById(id: number): Promise<Comments> {
        return await this.commentRepository.findOneBy({ id});
      }


    async findOneByUserId(user_id: number): Promise<Comments> {
    return await this.commentRepository.findOneBy({ user_id});
    }

    async update(comment: Comments): Promise<Comments> {
        return await this.commentRepository.save(comment );
    }

    async spCountCommentByProductId(user_id: number, product_id: number): Promise<number> {
        const query = this.commentRepository.createQueryBuilder('comment')
          .where('comment.user_id = :user_id', { user_id })
          .andWhere('comment.product_id = :product_id', { product_id })
        return await query.getCount();
      }
}
