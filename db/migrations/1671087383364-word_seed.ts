import { MigrationInterface, QueryRunner } from 'typeorm';

export class wordSeed1671087383364 implements MigrationInterface {
  name = 'wordSeed1671087383364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `INSERT INTO "word" (word) VALUES ('Colisionador'),('Entendido'),('Pescar'),('Matar'),('Dimensión'),('Confidencial'),('Bareknuckle'),('Espacioso'),('Paz'),('Balística'),('Confiar'),('Empresa'),('Diferente'),('Quinto'),('Absurdamente'),('Orientación'),('Más enojado'),('Excepción'),('Sonriente'),('Desnudo'),('Mojado'),('Gansos'),('Cereza'),('Zoom'),('Plano'),('Advertencia'),('Observador'),('Eliminar'),('Madera'),('Parecer'),('Delicatessen'),('Barcaza'),('Fertilidad'),('Enérgico'),('Trastornado'),('Enfado'),('Muñeca'),('Mohoso'),('Calle'),('Muerto')`,
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "word"`);
  }
}
