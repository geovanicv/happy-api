import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Orphanages from "./Orphanages";

@Entity('images')
export default class Image {
  
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  path: string;

  @ManyToOne(() => Orphanages, orphanages => orphanages.images)
  @JoinColumn({ name: 'orphanage_id'})
  orphanage: Orphanages;
}