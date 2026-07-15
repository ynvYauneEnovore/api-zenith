import { PartialType } from '@nestjs/mapped-types';
import { CreatePm2Dto } from './create-pm2.dto';

export class UpdatePm2Dto extends PartialType(CreatePm2Dto) {}
