import { Kysely } from 'kysely';
export async function up(db) {
    await db.schema
        .createTable('link')
        .addColumn('id', 'varchar', col => col.primaryKey())
        .addColumn('type', 'smallint', col => col.notNull()) // integer enum: 1->starterpack
        .addColumn('path', 'varchar', col => col.notNull())
        .addUniqueConstraint('link_path_unique', ['path'])
        .execute();
}
export async function down(db) {
    await db.schema.dropTable('link').execute();
}
//# sourceMappingURL=001-init.js.map