import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ProductSizeColorDataModel extends BaseEntity {
    @PrimaryGeneratedColumn() 
    size_id : number

    @Column({ default: 0 })
    quantity : number
}