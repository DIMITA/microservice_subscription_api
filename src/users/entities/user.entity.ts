export class User {}
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class Users {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  firstname: string;

  @Column()
  @ApiProperty()
  lastname: string;

  @Column({ unique: true })
  @ApiProperty()
  username: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  role: boolean;

  @Column()
  @ApiProperty()
  verifyToken: string;

  @Column()
  @ApiProperty({ type: 'bool', default: () => false })
  isVerify: boolean;

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updated_date: Date;
}
