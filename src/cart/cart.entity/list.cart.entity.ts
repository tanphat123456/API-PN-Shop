
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class ListCartModel{

    @PrimaryGeneratedColumn() 
    id : number

    @Column({ default: 0 })
    product_id : number

    @Column({ default: '' })
    product_name : string

    @Column({ default: 0 })
    color_id : number

    @Column({ default: '' })
    color_name : string

    @Column({ default: '' })
    color_code : string

    @Column({ default: 0 })
    size_id : number

    @Column({ default: '' })
    size_name : string
    
    @Column({ default: 0 })
    quantity : number

    @Column({ default: 0 })
    amount : number

    @Column({ default: 0 })
    discount_amount : number

    @Column({ default: 0 })
    total_amount : number

    @Column({ default: 0 })
    status : number

    @Column({ default: '' })
    created_at : Date 

    @Column({ default: '' })
    updated_at : Date 
}