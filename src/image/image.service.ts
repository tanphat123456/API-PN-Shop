import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection,Repository } from 'typeorm';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { ExceptionStoreProcedure } from 'src/utils.common/utils.exceptions.common/utils.store-procedure-exception.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { StoreProcedureResult } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.common';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { Images } from './image.entity/image.entity';
import { CreateImageDTO } from './image.dto/create.image.dto';

@Injectable()
export class ImageService {

    constructor(
    @InjectRepository(Images)
    private imageRepository: Repository<Images>, 
    private connection: Connection
){ }

        async getListImages( pagination : Pagination) : Promise<StoreProcedureResultInterface<Images>>{
            let result = await this.imageRepository.query('CALL sp_get_list_images(?,?,@status,@message,@totalRecord); SELECT @status AS status, @message AS message, @totalRecord AS total_record',
            [
                pagination.getLimit(),
                pagination.getOffset()
            ]);
            ExceptionStoreProcedure.validate(result);
            let data: StoreProcedureResultInterface<Images> = new StoreProcedureResult<Images>().getResultPagination(result)

        return data;
        }

        async createImage(createImageDTO : CreateImageDTO) : Promise<Images>{
            let image : Images = new Images();
            image.image_url = createImageDTO.image_url
            await this.imageRepository.create(image);
            await this.imageRepository.save(image);
            return image;
        }

        async findOneById(id: number): Promise<Images> {
            return await this.imageRepository.findOneBy({ id});
          }
    
        async update(product: Images): Promise<Images> {
            return await this.imageRepository.save(product);
        }
}
