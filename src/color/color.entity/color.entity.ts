import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity(
    {
        name: "color"
    }
)
export class Color {

    @PrimaryGeneratedColumn() 
    id : number

    @Column({ default: '' })
    name : string

    @Column({ default: '' })
    description: string

    @Column({ default: 0 })
    image_id: number

    @Column({ default: 0 })
    status : number

    @Column({ default: '' })
    created_at : Date 

    @Column({ default: '' })
    updated_at : Date 


}