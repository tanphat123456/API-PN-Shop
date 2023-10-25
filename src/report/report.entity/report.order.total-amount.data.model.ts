import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class OrderReportTotalAmountModel{
    @PrimaryGeneratedColumn() 
    total_order : number

    @Column({ default: 0 })
    total_order_amount: number

    @Column({ default: 0 })
    total_order_pay_complete: number

    @Column({ default: 0 })
    total_amount_pay_complete: number

    @Column({ default: 0 })
    total_order_unpaid: number

    @Column({ default: 0 })
    total_amount_unpaid: number

}