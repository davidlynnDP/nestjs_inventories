import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ProductCategories, ProductImage } from './';
import { Supplier } from 'src/suppliers/entities';
import { Location } from 'src/locations/entities';
import { InventoryMovement } from 'src/inventory-movements/entities';
import { Company } from 'src/company/entities';


@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true
    })
    title: string;

    @Column({
        type: 'text',
        unique: true
    })
    code: string;

    @Column({
        type: 'text'
    })
    description: string;

    @Column({
        type: 'float',
        default: 0
    })
    unitPrice: number;

    @Column({
        type: 'int',
        default: 0
    })
    currentStock: number;

    @Column({
        type: 'int',
        default: 0
    })
    minimumStock: number;

    //*Database relationships

    @OneToOne(
        () => Company,
        (company) => company.products, 
        /* options? - bardHelp */
    )
    company?: Company;

    @OneToOne(
        () => Supplier,
        (supplier) => supplier.products, 
        /* options? - bardHelp */
    )
    supplier?: Supplier;

    @OneToMany(  
        () => ProductImage,
        (productImage) => productImage.product, 
        { cascade: true, eager: true }  
    )
    images?: ProductImage[];

    @OneToOne(
        () => ProductCategories,
        (productCategory) => productCategory.products, 
        /* options? - bardHelp */
    )
    category?: ProductCategories;

    @OneToMany(  
        () => Location,
        (location) => location.products, 
        /* options? - bardHelp */
    )
    locations?: Location[];

    @OneToMany(  
        () => InventoryMovement,
        (inventoryMovement) => inventoryMovement.affectedProducts, 
        /* options? - bardHelp */
    )
    movements?: InventoryMovement[];
}
