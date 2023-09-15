import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product, ProductCategories } from '../../products/entities';
import { Order } from 'src/orders/entities';
import { Client } from 'src/clients/entities';
import { Supplier } from 'src/suppliers/entities';
import { Location } from 'src/locations/entities';


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

    @OneToMany(
        () => Client,
        (client) => client.company, 
        /* options? - bardHelp */
    )
    clients?: Client[];

    @OneToMany(
        () => Supplier,
        (supplier) => supplier.company, 
        /* options? - bardHelp */
    )
    suppliers?: Supplier[];

    @OneToMany(
        () => Location,
        (location) => location.company, 
        /* options? - bardHelp */
    )
    locations?: Location[];

    @OneToMany(
        () => ProductCategories,
        (category) => category.company, 
        /* options? - bardHelp */
    )
    categories?: ProductCategories[];

        
    @BeforeInsert()  
    verifyEmailBeforeInserting() {

        this.email = this.email.toLowerCase();
    }

    @BeforeUpdate()   
    verifyEmailBeforeUpdating() {

        this.email = this.email.toLowerCase();
    }

}
