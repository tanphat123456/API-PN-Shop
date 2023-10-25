import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ProductSizeDetailModel extends BaseEntity {
    
    @PrimaryGeneratedColumn() 
    product_id : number

    @Column({ default: 0 })
    size_id : number

    @Column({ default: '' })
    size : string

    @Column({ default: 0 })
    quantity : number
    
}