import {} from 'kysely';
export async function up(db) {
    // Remove existing items from safelink_rule that were duplicated due to broken cursor
    await db.deleteFrom(['safelink_rule']).execute();
    // Delete the old cursor
    await db.deleteFrom(['safelink_cursor']).execute();
    await db.schema
        .alterTable('safelink_cursor')
        .addPrimaryKeyConstraint('pk_id', ['id'])
        .execute();
}
export async function down(db) {
    // Remove any rules that were added
    await db.deleteFrom(['safelink_rule']).execute();
    // Delete the cursor
    await db.deleteFrom(['safelink_cursor']).execute();
    await db.schema
        .alterTable('safelink_cursor')
        .dropConstraint('pk_id')
        .execute();
}
//# sourceMappingURL=003-safelink-cursor-constraint.js.map