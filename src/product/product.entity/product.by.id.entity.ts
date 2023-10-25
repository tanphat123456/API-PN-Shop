import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ProductSizeDetailModel } from './product.size.detail.entity';
@Entity()
export class ProductDetailByIdDataModel extends BaseEntity {
    @PrimaryGeneratedColumn() 
    color_id : number

    @Column({ default: '' })
    color_name : string

    @Column({ default: '' })
    color_code : string

    @Column("text", { array: true })
    size_detail : ProductSizeDetailModel[]

    @Column("text", { array: true })
    product_image_color: string[];
}