import { Column, Entity, OneToMany } from 'typeorm';
import { USER_TYPE } from '../../../types';

import { BaseModel } from '../../common/entities/baseModel.entity';

@Entity()
export class User extends BaseModel {
  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  isActive: boolean;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: USER_TYPE,
    default: USER_TYPE.SUPERVISOR,
  })
  userType: USER_TYPE;
}
