import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Location } from 'src/locations/entities';
import { Product } from 'src/products/entities';
import { TypesOfInventoryMovement } from '../enums';


@Entity({ name: 'inventory_movements' })
export class InventoryMovement {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({
        type: 'date'
    })
    inventoryMovementDate: Date;

    @Column({
        enum: TypesOfInventoryMovement
    })
    inventoryMovementType: TypesOfInventoryMovement;

    @OneToMany(  
        () => Product,
        (product) => product.movements, 
        /* options? - bardHelp */
    )
    affectedProducts?: Product[];

    @Column({
        type: 'int',
        default: 0
    })
    amount: number;

    @OneToOne(  
        () => Location,
        (location) => location.movements, 
        /* options? - bardHelp */
    )
    sourceLocation?: Location;

    @OneToOne(  
        () => Location,
        (location) => location.movements, 
        /* options? - bardHelp */
    )
    destinationLocation?: Location;

    
}
