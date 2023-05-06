import { Report } from 'src/reports/report.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
  OneToMany,
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

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

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
