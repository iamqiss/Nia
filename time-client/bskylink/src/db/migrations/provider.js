import { Migration, MigrationProvider } from 'kysely';
export class DbMigrationProvider {
    migrations;
    constructor(migrations) {
        this.migrations = migrations;
    }
    async getMigrations() {
        return this.migrations;
    }
}
//# sourceMappingURL=provider.js.map