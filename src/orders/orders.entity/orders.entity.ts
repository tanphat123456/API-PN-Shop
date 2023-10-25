import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity(
    {
        name: "orders"
    }
)
export class Order {

    @PrimaryGeneratedColumn() 
    id : number

    @Column({ default: '' })
    code : string

    @Column({ default: 0 })
    user_id: number

    @Column({ default: '' })
    user_name : string

    @Column({ default: '' })
    user_email : string

    @Column({ default: '' })
    user_phone : string

    @Column({ default: '' })
    birthday :  Date 

    @Column({ default: '' })
    address : string

    @Column({ default: 0 })
    total_amount: number

    @Column({ default: 0 })
    status: number

    @Column({ default: '' })
    created_at : Date 

    @Column({ default: '' })
    updated_at : Date 


}