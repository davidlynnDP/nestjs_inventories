import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';


@Controller('seed') // localhost:3000/api/seed
export class SeedController {

  constructor(
    private readonly seedService: SeedService
  ) {}

  @Get()
  runInformationSeed() {
    return this.seedService.populateDatabase()
  }
}
