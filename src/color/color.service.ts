import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/product.entity/product.entity';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { ExceptionStoreProcedure } from 'src/utils.common/utils.exceptions.common/utils.store-procedure-exception.common';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { StoreProcedureResult } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { Repository } from 'typeorm';
import { CreateColorDTO } from './color.dto/color.create.dto';
import { UpdateColorDTO } from './color.dto/color.update.dto';
import { Color } from './color.entity/color.entity';

@Injectable()
export class ColorService {
    constructor(
        @InjectRepository(Color)
        private colorRepository: Repository<Color>
    ){ }

    async createColor(createColorDTO : CreateColorDTO): Promise<Color>{
        let color : Color = new Color()
        color.name = createColorDTO.name
        color.description = createColorDTO.description
        color.image_id = createColorDTO.image_id
        color.status = 1

        await this.colorRepository.create(color);
        await this.colorRepository.save(color);
        return color;
    }

    async updateColor(id : number ,updateColorDTO : UpdateColorDTO): Promise<Color>{
        let colorId : Color = await this.findOneById(id);
        if(!colorId){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "Màu không tồn tại !"), HttpStatus.OK);
        }
        else{
            colorId.description = updateColorDTO.description
            colorId.image_id = updateColorDTO.image_id
            await this.update(colorId)
        }
        return colorId;
    }

    async getListColor(key_search : string , status : number , pagination : Pagination): Promise<StoreProcedureResultInterface<Color>>{
        let result = await this.colorRepository.query('CALL sp_get_list_color(?,?,?,?,@status,@message,@totalRecord); SELECT @status AS status, @message AS message, @totalRecord AS total_record',
        [
            key_search,
            status,
            pagination.getLimit(),
            pagination.getOffset()
        ]);
        ExceptionStoreProcedure.validate(result);
        let data: StoreProcedureResultInterface<Color> = new StoreProcedureResult<Color>().getResultPagination(result)

        return data;
    }

    async findOneById(id: number): Promise<Color> {
        return await this.colorRepository.findOneBy({ id});
      }

    async update(color: Color): Promise<Color> {
        return await this.colorRepository.save(color);
    }
}
