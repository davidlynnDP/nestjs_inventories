import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './product.entity';
import { Company } from 'src/company/entities';


@Entity({ name: 'product_categories' }) 
export class ProductCategories {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true
    })
    category: string;

    @OneToMany(
        () => Product,
        (product) => product.category,
        /* options? - bardHelp */
    )
    products?: Product[];

    @OneToOne(
        () => Company,
        (company) => company.categories,
        /* options? - bardHelp */
    )
    company?: Company;

}