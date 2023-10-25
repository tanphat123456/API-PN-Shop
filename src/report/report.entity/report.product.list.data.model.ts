import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class ProductReportDataModel{

    @PrimaryGeneratedColumn() 
    id : number

    @Column({ default: 0 })
    supplier_id :number

    supplier_name : string

    @Column({ default: 0 })
    category_id : number

    @Column({ default: '' })
    category_name :string

    @Column({ default: '' })
    product_name :string

    @Column({ default: '' })
    code  :string

    @Column({ default: '' })
    description  :string

    @Column({ default: 0 })
    amount  :number

    @Column({ default: 0 })
    discount_amount  :number

    @Column({ default: 0 })
    total_amount  :number

    @Column({ default: 0 })
    total_quantity :number

    @Column({ default: 0 })
    total_quantity_amount :number

    @Column({ default: 0 })
    total_quantity_sell :number

    @Column({ default: 0 })
    total_quantity_amount_sell :number
}