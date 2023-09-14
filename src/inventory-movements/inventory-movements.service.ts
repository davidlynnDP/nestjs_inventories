import { Injectable } from '@nestjs/common';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';
import { UpdateInventoryMovementDto } from './dto/update-inventory-movement.dto';
import { InventoryMovement } from './entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class InventoryMovementsService {


  constructor(
    @InjectRepository(InventoryMovement)
    private readonly inventoryMovementRepository: Repository<InventoryMovement>, 

    private readonly commonService: CommonService,
  ) {}

  create(createInventoryMovementDto: CreateInventoryMovementDto) {
    return 'This action adds a new inventoryMovement';
  }

  findAll() {
    return `This action returns all inventoryMovements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventoryMovement`;
  }

  update(id: number, updateInventoryMovementDto: UpdateInventoryMovementDto) {
    return `This action updates a #${id} inventoryMovement`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventoryMovement`;
  }

  async deleteAllMovements() {

    const query = this.inventoryMovementRepository.createQueryBuilder('movements'); 

    try {
      return await query
        .delete()
        .where({})  
        .execute();

    } catch ( error ) {
      this.commonService.errorHandler( error )
    }
  }
}
