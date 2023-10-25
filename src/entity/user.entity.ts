import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true, name: 'refresh_token' })
  refreshToken: string;
}