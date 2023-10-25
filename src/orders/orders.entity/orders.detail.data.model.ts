import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class OrderDetailDataModel{
    @PrimaryGeneratedColumn() 
    id 

    @Column({ default: 0 })
    user_id : number

    @Column({ default: 0 })
    order_id : number

    @Column({ default: 0 })
    product_id : number

    @Column({ default: 0 })
    color_id : number

    @Column({ default: 0 })
    size_id : number
 
    @Column({ default: '' })
    product_name : string

    @Column({ default: '' })
    product_color : string 
    
    @Column({ default: '' })
    product_size : string    
    
    @Column({ default: 0 })
    product_quantity : number

    @Column({ default: 0 })
    discount_percent : number

    @Column({ default: 0 })
    discount_amount : number

    @Column({ default: 0 })
    amount : number

    @Column({ default: 0 })
    total_amount : number

    @Column({ default: 0 })
    status : number

    @Column({ default: '' })
    created_at : Date

    @Column({ default: '' })
    updated_at : Date  
}