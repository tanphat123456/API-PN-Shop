import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ProductDetailColorDataModel extends BaseEntity {

    @PrimaryGeneratedColumn() 
    color_id : number

    @Column({ default: '' })
    color_name : string

    @Column({ default: '' })
    description : string

    @Column({ default: '' })
    quantity : string
    
}