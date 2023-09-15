import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from 'src/products/entities';
import { Company } from 'src/company/entities';



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

    @OneToOne(  
        () => Company,
        (company) => company.suppliers, 
        /* options? - bardHelp */
    )
    company?: Company;

    @BeforeInsert()  
    verifyEmailBeforeInserting() {

        this.email = this.email.toLowerCase();
    }

    @BeforeUpdate()   
    verifyEmailBeforeUpdating() {

        this.email = this.email.toLowerCase();
    }
}
