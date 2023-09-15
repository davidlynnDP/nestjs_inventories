import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from 'src/orders/entities';
import { Company } from 'src/company/entities';



@Entity({ name: 'clients' })
export class Client {

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
    })
    address: string;

    @OneToOne(
        () => Company,
        (company) => company.clients, 
        /* options? - bardHelp */
    )
    company?: Company;

    @OneToMany(
        () => Order,
        (order) => order.client, 
        /* options? - bardHelp */
    )
    orders?: Order[];

    
    @BeforeInsert()  
    verifyEmailBeforeInserting() {

        this.email = this.email.toLowerCase();
    }

    @BeforeUpdate()   
    verifyEmailBeforeUpdating() {

        this.email = this.email.toLowerCase();
    }
}
