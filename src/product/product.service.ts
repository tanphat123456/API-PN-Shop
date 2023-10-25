import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection,Repository } from 'typeorm';
import { Product } from './product.entity/product.entity';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { ExceptionStoreProcedure } from 'src/utils.common/utils.exceptions.common/utils.store-procedure-exception.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { StoreProcedureResult } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.common';
import { CreateProductDTO } from './product.dto/create.product.dto';
import { ProductStatusEnum } from './product.enum/product.status.enum';
import { UpdateProductDTO } from './product.dto/update.product.dto';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { ProductListDetailModel } from './product.entity/product.list.detail.entity';
import { ProductDetailByIdDataModel } from './product.entity/product.by.id.entity';
import { CreateProductDetailDTO } from './product.dto/create.product.detail.dto';
import { ProductReportDataModel } from 'src/report/report.entity/report.product.list.data.model';
import { ProductDetailReportDataModel } from 'src/report/report.entity/report.product.detail.data.model';

@Injectable()
export class ProductService {

    constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>, 
    private connection: Connection
){ }

    async getListProduct(supplier_id: number , category_id : number ,key_search : string , status : number , sort : number , pagination : Pagination): Promise<StoreProcedureResultInterface<ProductListDetailModel>>{
        let result = await this.productRepository.query('CALL sp_get_list_product(?,?,?,?,?,?,?,@status,@message,@totalRecord); SELECT @status AS status, @message AS message, @totalRecord AS total_record',
        [
            supplier_id,
            category_id,
            key_search,
            status,
            sort,
            pagination.getLimit(),
            pagination.getOffset()
        ]);
        
        ExceptionStoreProcedure.validate(result);
        let data: StoreProcedureResultInterface<ProductListDetailModel> = new StoreProcedureResult<ProductListDetailModel>().getResultPagination(result)

        return data;
    }

    async getDetailProduct(product_id: number , pagination : Pagination): Promise<StoreProcedureResultInterface<ProductDetailByIdDataModel>>{
        let result = await this.productRepository.query('CALL sp_get_product_detail(?,?,?,@status,@message,@totalRecord); SELECT @status AS status, @message AS message, @totalRecord AS total_record',
        [
            product_id,
            pagination.getLimit(),
            pagination.getOffset()
        ]);
        
        ExceptionStoreProcedure.validate(result);
        let data: StoreProcedureResultInterface<ProductDetailByIdDataModel> = new StoreProcedureResult<ProductDetailByIdDataModel>().getResultPagination(result)

        return data;
    }

    async createProduct(createProductDTO : CreateProductDTO ) : Promise<Product>{

        let result = await this.productRepository.query('CALL sp_create_new_product(?,?,?,?,?,?,?,?,@status,@message); SELECT @status AS status, @message AS message',
        [
            createProductDTO.supplier_id,
            createProductDTO.category_id,
            createProductDTO.name,
            createProductDTO.description,
            createProductDTO.amount,
            createProductDTO.discount_amount,
            createProductDTO.discount_percent,
            1
        ]);
        ExceptionStoreProcedure.validate(result);
        let data: Product = new StoreProcedureResult<Product>().getResultDetail(result);
        
        return data;
    }

    async createProductDetail(product_id : number ,createProductDetailDTO : CreateProductDetailDTO) : Promise<Product>{
        let result = await this.productRepository.query('CALL sp_create_new_product_detail(?,?,?,?,@status,@message); SELECT @status AS status, @message AS message',
        [
            product_id,
            createProductDetailDTO.color_id,
            JSON.stringify(createProductDetailDTO.image_ids),
            JSON.stringify(createProductDetailDTO.product_size_quantity_data)
        ]);
        console.log(JSON.stringify(createProductDetailDTO.image_ids));
        console.log(JSON.stringify(createProductDetailDTO.product_size_quantity_data));
        
        
        
        ExceptionStoreProcedure.validate(result);
        
        let data : Product = await this.findOneById(product_id);
        return data;
    }

    async updateProduct (product_id : number ,updateProductDTO : UpdateProductDTO  ) : Promise<Product>{

        let product : Product = await this.findOneById(product_id);
        if(product == null){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "Sản phẩm không tồn tại !"), HttpStatus.OK);
        }
        product.name = updateProductDTO.name
        product.description = updateProductDTO.description
        product.amount = updateProductDTO.amount
        product.discount_percent = updateProductDTO.discount_percent
        product.discount_amount = updateProductDTO.discount_amount
        product.total_amount = updateProductDTO.amount - updateProductDTO.discount_amount
        await this.update(product)
        return product;
    }

    async findOneById(id: number): Promise<Product> {
        return await this.productRepository.findOneBy({ id});
      }

    async update(product: Product): Promise<Product> {
        return await this.productRepository.save(product);
    }

    async getRpProductTotalAmount( from_date : string ,  to_date : string , pagination : Pagination) : Promise<StoreProcedureResultInterface<ProductReportDataModel>>{
        let result = await this.productRepository.query('CALL sp_get_rp_by_product(?,?,?,?,@status,@message,@totalRecord); SELECT @status AS status, @message AS message, @totalRecord AS total_record',
        [
            from_date,
            to_date,
            pagination.getLimit(),
            pagination.getOffset()
        ]);
        ExceptionStoreProcedure.validate(result);   
        let data: StoreProcedureResultInterface<ProductReportDataModel> = new StoreProcedureResult<ProductReportDataModel>().getResultPagination(result)
        return data;
    }

    async getRpProductDetail(product_id : number ,  from_date : string ,  to_date : string , pagination : Pagination): Promise<StoreProcedureResultInterface<ProductDetailReportDataModel>>{
        let result = await this.productRepository.query('CALL sp_get_rp_product_detail_by_product(?,?,?,?,?,@status,@message,@totalRecord); SELECT @status AS status, @message AS message, @totalRecord AS total_record',
        [
            product_id,
            from_date,
            to_date,
            pagination.getLimit(),
            pagination.getOffset()
        ]);
        ExceptionStoreProcedure.validate(result);   
        let data: StoreProcedureResultInterface<ProductDetailReportDataModel> = new StoreProcedureResult<ProductDetailReportDataModel>().getResultPagination(result)
        return data;
    }

}
