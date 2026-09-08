import { Test, TestingModule } from '@nestjs/testing';
import { HotelStaffController } from './hotel-staff.controller';

describe('HotelStaffController', () => {
  let controller: HotelStaffController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelStaffController],
    }).compile();

    controller = module.get<HotelStaffController>(HotelStaffController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
