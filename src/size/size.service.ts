import { Size } from './size.entity/size.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/product.entity/product.entity';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { ExceptionStoreProcedure } from 'src/utils.common/utils.exceptions.common/utils.store-procedure-exception.common';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { StoreProcedureResult } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { Repository } from 'typeorm';
import { CreateSizeDTO } from './size.dto/size.create.dto';
import { UpdateSizeDTO } from './size.dto/size.update.dto';


@Injectable()
export class SizeService {
    constructor(
        @InjectRepository(Size)
        private sizeRespository : Repository<Size>
    ){}

    async createSize(createSizeDTO : CreateSizeDTO): Promise<Size>{
        let size : Size = new Size();
        size.name = createSizeDTO.name
        size.description = createSizeDTO.description
        size.status = 0

        await this.sizeRespository.create(size);
        await this.sizeRespository.save(size);

        return size;
    }

    async updateSize( id : number , updateSizeDTO : UpdateSizeDTO) : Promise<Size>{
        let sizeId : Size = await this.findOneById(id);
        if(!sizeId){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "Size không tồn tại !"), HttpStatus.OK);
        }
        else{
            sizeId.name = updateSizeDTO.name
            sizeId.description = updateSizeDTO.description
            await this.update(sizeId);
        }
        return sizeId;
    }

    async getListSize(key_search : string , status : number , pagination : Pagination): Promise<StoreProcedureResultInterface<Size>>{
        let result = await this.sizeRespository.query('CALL sp_get_list_size(?,?,?,?,@status,@message,@totalRecord); SELECT @status AS status, @message AS message, @totalRecord AS total_record',
        [
            key_search,
            status,
            pagination.getLimit(),
            pagination.getOffset()
        ]);
        ExceptionStoreProcedure.validate(result);
        let data: StoreProcedureResultInterface<Size> = new StoreProcedureResult<Size>().getResultPagination(result)

        return data;
    }
    async findOneById(id: number): Promise<Size> {
        return await this.sizeRespository.findOneBy({ id});
      }

    async update(size: Size): Promise<Size> {
        return await this.sizeRespository.save(size);
    }


}
