import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { InventoryMovement } from 'src/inventory-movements/entities';
import { Product } from 'src/products/entities';



@Entity({ name: 'locations' })
export class Location {

    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true
    })
    locationName: string;

    @Column({
        type: 'text',
    })
    locationAddress: string;

    @OneToMany(  
        () => Product,
        (product) => product.locations, 
        /* options? - bardHelp */
    )
    products?: Product[];

    @OneToMany(  
        () => InventoryMovement,
        (inventoryMovement) => inventoryMovement, 
        /* options? - bardHelp */
    )
    movements?: InventoryMovement[];

}
