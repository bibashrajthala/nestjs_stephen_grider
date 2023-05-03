import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
} from 'typeorm';
// import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // @Exclude()
  @Column()
  email: string;

  // @Exclude()
  @Column()
  password: string;

  @AfterInsert()
  createLog() {
    console.log(`user created with id:`, this.id);
  }
  @AfterUpdate()
  updatelog() {
    console.log(`user updated with id:`, this.id);
  }
  @BeforeRemove()
  removeLog() {
    console.log(`user removed with id:`, this.id);
  }
}
