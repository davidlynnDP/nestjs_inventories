import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from 'src/orders/entities';



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

    @OneToMany(
        () => Order,
        (order) => order.client, 
        /* options? - bardHelp */
    )
    orders?: Order[];

}
