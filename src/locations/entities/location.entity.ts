import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { InventoryMovement } from 'src/inventory-movements/entities';
import { Product } from 'src/products/entities';
import { Company } from 'src/company/entities';



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
        (product) => product.location, 
        /* options? - bardHelp */
    )
    products?: Product[];

    @OneToMany(  
        () => InventoryMovement,
        (inventoryMovement) => inventoryMovement, 
        /* options? - bardHelp */
    )
    movements?: InventoryMovement[];

    @OneToOne(  
        () => Company,
        (company) => company.locations, 
        /* options? - bardHelp */
    )
    company?: Company;

}
