import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity(
    {
        name: "images"
    }
)
export class Images {

    @PrimaryGeneratedColumn() 
    id : number

    @Column({ default: '' })
    image_url : string

    @Column({ default: '' })
    created_at : Date 

    @Column({ default: '' })
    updated_at : Date 
}