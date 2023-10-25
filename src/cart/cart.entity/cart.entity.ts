import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity(
    {
        name: "carts"
    }
)
export class Cart {

    @PrimaryGeneratedColumn() 
    id : number

    @Column({ default: 0 })
    user_id : number

    @Column({ default: 0 })
    product_id : number

    @Column({ default: 0 })
    color_id : number

    @Column({ default: 0 })
    size_id : number
    
    @Column({ default: 0 })
    quantity : number

    @Column({ default: 0 })
    status : number

    @Column({ default: '' })
    created_at : Date 

    @Column({ default: '' })
    updated_at : Date 
}