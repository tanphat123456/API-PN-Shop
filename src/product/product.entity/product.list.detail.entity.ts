import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ProductDetailColorDataModel } from './product.detail.color.data.model';

@Entity()
export class ProductListDetailModel extends BaseEntity {

    @PrimaryGeneratedColumn() 
    id : number

    @Column({ default: '' })
    supplier_name : string

    @Column({ default: '' })
    category_name : string

    @Column({ default: '' })
    name : string

    @Column({ default: '' })
    code : string

    @Column({ default: '' })
    description: string

    @Column("text", { array: true })
    product_image: string[];

    @Column({ default: 0 })
    amount: number

    @Column({ default: 0 })
    discount_amount: number

    @Column({ default: 0 })
    discount_percent: number

    @Column("text", { array: true })
    product_detail: ProductDetailColorDataModel[];

    @Column({ default: 0 })
    status : number

    @Column({ default: '' })
    created_at : Date 

    @Column({ default: '' })
    updated_at : Date 

}