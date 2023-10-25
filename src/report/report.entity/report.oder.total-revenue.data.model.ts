import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class OrderReportTotalRevenueModel{
    @PrimaryGeneratedColumn() 
    total_revenue : number

    @Column({ default: 0 })
    total_expense: number

    @Column({ default: 0 })
    total_profit: number
}