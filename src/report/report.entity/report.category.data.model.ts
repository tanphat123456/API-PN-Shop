import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CategoryReportDataModel{
    @PrimaryGeneratedColumn() 
    id : number         
    
    @Column({ default: '' })
    name : string           
    
    @Column({ default: '' })
    description : string   
    
    @Column({ default: 0 })
    status : number       
    
    @Column({ default: 0 })
    total_quantity_remain : number    
    
    @Column({ default: 0 })
    total_quantity_sell : number       

    @Column({ default: 0 })
    total_quantity_amount_sell : number
}