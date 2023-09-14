import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from 'src/products/entities';



@Entity({ name: 'suppliers' })
export class Supplier {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
    })
    fullName: string;

    @Column({
        type: 'text',
        unique: true
    })
    email: string;

    @Column({
        type: 'text',
        unique: true
    })
    phoneNumber: string;

    @Column({
        type: 'text',
        unique: true
    })
    address: string;

    @Column({
        type: 'text',
    })
    www: string;

    @OneToMany(  
        () => Product,
        (product) => product.supplier, 
        /* options? - bardHelp */
    )
    products?: Product[];


    @BeforeInsert()  
    verifyEmailBeforeInserting() {

        this.email = this.email.toLowerCase();
    }

    @BeforeUpdate()   
    verifyEmailBeforeUpdating() {

        this.email = this.email.toLowerCase();
    }
}
