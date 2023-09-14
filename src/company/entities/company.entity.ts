import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from '../../products/entities';
import { Order } from 'src/orders/entities';


@Entity({ name: 'companies' })
export class Company {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({
        type: 'text',
        unique: true
    })
    companyName: string;

    @Column({
        type: 'text',
        unique: true
    })
    email: string;

    @Column({
        type: 'text',
        select: false
    })
    password: string;

    @Column({
        type: 'text',
        unique: true
    })
    phoneNumber: string;

    @Column({
        type: 'text',
    })
    address: string;

    @Column({
        type: 'text',
    })
    www: string;

    @OneToMany(
        () => Order,
        (order) => order.company, 
        /* options? - bardHelp */
    )
    orders?: Order[];
    
    @OneToMany(  
        () => Product,
        (product) => product.company, 
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
