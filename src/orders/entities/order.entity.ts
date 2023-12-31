import { BeforeInsert, Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Client } from 'src/clients/entities';
import { Company } from 'src/company/entities';
import { Product } from 'src/products/entities';
import { formattedDate } from 'src/inventory-movements/helpers';


@Entity({ name: 'orders' })
export class Order {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({
        type: 'text'
    })
    orderDate: string;

    @ManyToOne(
        () => Client,
        (client) => client.orders, 
        /* options? - bardHelp */
    )
    client?: Client;

    @OneToOne(
        () => Company,
        (company) => company.orders, 
        /* options? - bardHelp */
    )
    company?: Company;

    @ManyToMany(
        () => Product,
        (product) => product, 
        /* options? - bardHelp */
    )
    productsIncludedOnOrder?: Product[];

    @Column({
        type: 'int',
        default: 0
    })
    quantityProductsIncludedOnOrder: number;

    @Column({
        type: 'float',
        default: 0
    })
    subtotal: number;

    @Column({
        type: 'float',
        default: 0
    })
    tax: number;

    @Column({
        type: 'float',
        default: 0
    })
    total: number;

    @BeforeInsert()  
    createDateBeforeInserting() {

        this.orderDate = formattedDate();
    }

}
