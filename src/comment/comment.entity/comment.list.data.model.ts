import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CommentDataModel{

    @PrimaryGeneratedColumn() 
    id : number

    @Column({ default: 0 })
    product_id : number

    @Column({ default: 0 })
    user_id : number 

    @Column({ default: '' })
    product_name : string

    @Column({ default: '' })
    user_name : string

    @Column({ default: '' })
    user_image_url : string

    @Column({ default: 0 })
    star_rating : number 

    @Column({ default: '' })
    user_comment : string

    @Column({ default: 0 })
    status : number 

    @Column({ default: '' })
    created_at : Date 

    @Column({ default: '' })
    updated_at : Date 
}