import { BeforeInsert, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Location } from 'src/locations/entities';
import { Product } from 'src/products/entities';
import { formattedDate } from '../helpers';
import { Company } from 'src/company/entities';


@Entity({ name: 'inventory_movements' })
export class InventoryMovement {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({
        type: 'text'
    })
    inventoryMovementDate: string;

    @Column({
        type: 'text',
    })
    inventoryMovementType: 'entrance' | 'exit' | 'transfer' | 'devolution';

    @OneToMany(  
        () => Product,
        (product) => product.movement, 
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

    @OneToOne(  
        () => Company,
        (company) => company.movements, 
        /* options? - bardHelp */
    )
    company?: Company;
    
    @BeforeInsert()  
    createDateBeforeInserting() {

        this.inventoryMovementDate = formattedDate();
    }
}
