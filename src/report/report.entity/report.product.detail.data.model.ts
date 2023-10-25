import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class ProductDetailReportDataModel{

    @PrimaryGeneratedColumn() 
    product_id : number    

    @Column({ default: 0 })
    color_id : number           

    @Column({ default: 0 })
    size_id : number            

    @Column({ default: '' })
    color_name : string    
    
    @Column({ default: '' })
    color_code : string       

    @Column({ default: '' })
    size_name : string      
    
    @Column({ default: 0 })
    total_quantity : number       
     
    @Column({ default: 0 })
    total_amount : number         
     
    @Column({ default: 0 })
    quantity_remain : number      
     
    @Column({ default: 0 })
    total_amount_remain : number  
     
    @Column({ default: 0 })
    quantity_sell : number        
     
    @Column({ default: 0 })
    total_amount_sell : number    
}