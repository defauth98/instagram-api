import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class createChat1634074879450 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'chat',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
        ],
      }),
    );

    await queryRunner.addColumn('chat', new TableColumn({
      name: 'userId',
      type: 'int',
    }));

    await queryRunner.createForeignKey('chat', new TableForeignKey({
      columnNames: ['userId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'user',
      onDelete: 'CASCADE',
    }));

    await queryRunner.addColumn('chat', new TableColumn({
      name: 'userId2',
      type: 'int',
    }));

    await queryRunner.createForeignKey('chat', new TableForeignKey({
      columnNames: ['userId2'],
      referencedColumnNames: ['id'],
      referencedTableName: 'user',
      onDelete: 'CASCADE',
    }));

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('chat');
  }

}
