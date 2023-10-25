import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection,Repository } from 'typeorm';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { ExceptionStoreProcedure } from 'src/utils.common/utils.exceptions.common/utils.store-procedure-exception.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { StoreProcedureResult } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.common';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { Category } from './category.entity/category.entity';
import { CreateCategoryDTO } from './category.dto/create.category.dto';
import { CategoryStatusEnum } from './category.enum/category.enum';
import { CategoryReportDataModel } from 'src/report/report.entity/report.category.data.model';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>, 
        private connection: Connection
    ){ }

    async getListCategory( key_search : string , status : number, pagination : Pagination) : Promise<StoreProcedureResultInterface<Category>>{ 
        let result = await this.categoryRepository.query('CALL sp_get_list_category(?,?,?,?,@status,@message,@totalRecord); SELECT @status AS status, @message AS message, @totalRecord AS total_record',
        [
            key_search,
            status,
            pagination.getLimit(),
            pagination.getOffset()
        ]);
        ExceptionStoreProcedure.validate(result);
        let data: StoreProcedureResultInterface<Category> = new StoreProcedureResult<Category>().getResultPagination(result)

        return data;
    }   

    async findOneById(id: number): Promise<Category> {
        return await this.categoryRepository.findOneBy({ id});
      }

    async findOneByName(name: string): Promise<Category> {
    return await this.categoryRepository.findOneBy({ name});
    }

      async update(category: Category): Promise<Category> {
        return await this.categoryRepository.save(category);
    }


    async createCategory(createCategoryDTO : CreateCategoryDTO) : Promise<Category>{
        let category : Category = new Category();

        category.name = createCategoryDTO.name 
        category.description = createCategoryDTO.description 
        category.status = CategoryStatusEnum.AVAILABLE;

        await this.categoryRepository.create(category);
        await this.categoryRepository.save(category);
        return category;
    }


    async getRpCateforyTotalAmount( category_id : number,from_date : string ,  to_date : string , pagination : Pagination) : Promise<StoreProcedureResultInterface<CategoryReportDataModel>>{
        let result = await this.categoryRepository.query('CALL sp_get_rp_by_category(?,?,?,?,?,@status,@message,@totalRecord); SELECT @status AS status, @message AS message, @totalRecord AS total_record',
        [
            category_id,
            from_date,
            to_date,
            pagination.getLimit(),
            pagination.getOffset()
        ]);
        ExceptionStoreProcedure.validate(result);   
        let data: StoreProcedureResultInterface<CategoryReportDataModel> = new StoreProcedureResult<CategoryReportDataModel>().getResultPagination(result)
        return data;
    }

}