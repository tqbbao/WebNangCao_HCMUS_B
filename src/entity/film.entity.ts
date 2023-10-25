import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Language } from "./language.entity";

@Entity("film", { schema: "temp_sakila" })
export class Film {
  @PrimaryGeneratedColumn({ type: "smallint", name: "film_id", unsigned: true })
  filmId: number;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("year", { name: "release_year", nullable: true })
  releaseYear: number | null;

  @Column("tinyint", { name: "language_id", unsigned: true })
  languageId: number;

  @Column("tinyint", {
    name: "original_language_id",
    nullable: true,
    unsigned: true,
  })
  originalLanguageId: number | null;

  @Column("tinyint", {
    name: "rental_duration",
    unsigned: true,
    default: () => "'3'",
  })
  rentalDuration: number;

  @Column("decimal", {
    name: "rental_rate",
    precision: 4,
    scale: 2,
    default: () => "'4.99'",
  })
  rentalRate: string;

  @Column("smallint", { name: "length", nullable: true, unsigned: true })
  length: number | null;

  @Column("decimal", {
    name: "replacement_cost",
    precision: 5,
    scale: 2,
    default: () => "'19.99'",
  })
  replacementCost: string;

  @Column("enum", {
    name: "rating",
    nullable: true,
    enum: ["G", "PG", "PG-13", "R", "NC-17"],
    default: () => "'G'",
  })
  rating: "G" | "PG" | "PG-13" | "R" | "NC-17" | null;

  @Column("set", {
    name: "special_features",
    nullable: true,
    enum: ["Trailers", "Commentaries", "Deleted Scenes", "Behind the Scenes"],
  })
  specialFeatures:
    | ("Trailers" | "Commentaries" | "Deleted Scenes" | "Behind the Scenes")[]
    | null;

  @Column("timestamp", {
    name: "last_update",
    default: () => "CURRENT_TIMESTAMP",
  })
  lastUpdate: Date;

  @ManyToOne(() => Language, (language) => language.films, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "language_id", referencedColumnName: "languageId" }])
  language: Language;

  @ManyToOne(() => Language, (language) => language.films2, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "original_language_id", referencedColumnName: "languageId" },
  ])
  originalLanguage: Language;

//   @OneToMany(() => FilmActor, (filmActor) => filmActor.film)
//   filmActors: FilmActor[];

//   @OneToMany(() => FilmCategory, (filmCategory) => filmCategory.film)
//   filmCategories: FilmCategory[];

//   @OneToMany(() => Inventory, (inventory) => inventory.film)
//   inventories: Inventory[];
}
