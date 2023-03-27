import { randomBytes } from "crypto";
import format from "pg-format";
import { default as migrate } from "node-pg-migrate";
import pool from "@/src/db";
import config from "@/src/config";

const { dbConfig } = config;

const defConfig = { max: 1, idleTimeoutMillis: 0 };

class Context {
  roleName: string;

  constructor(name: string) {
    this.roleName = name;
  }

  static async build() {
    try {
      // Randomly generating a role name to connect to PG as
      const roleName = "freshness" + randomBytes(4).toString("hex");

      const configOpts = {
        ...dbConfig,
        ...defConfig,
      };

      await pool.connect(configOpts);

      // Create a new role
      //make it super user else we get error: permission denied to create extension "uuid-ossp"
      await pool.query(
        format(
          "CREATE ROLE %I SUPERUSER LOGIN PASSWORD %L;",
          roleName,
          roleName
        )
      );

      // Create a schema with the same name
      await pool.query(
        format("CREATE SCHEMA %I AUTHORIZATION %I;", roleName, roleName)
      );

      // Disconnect entirely from PG
      await pool.close();

      const newDbConfig = {
        ...dbConfig,
        user: roleName,
        password: roleName,
        ...defConfig,
      };

      // Run our migrations in the new schema
      await migrate({
        schema: roleName,
        migrationsTable: "migrations",
        direction: "up",
        log: () => null,
        noLock: true,
        dir: "migrations",
        databaseUrl: newDbConfig,
      });

      // Connect to PG as the newly created role
      await pool.connect(newDbConfig);

      return new Context(roleName);
    } catch (error) {
      console.log(error);
      return new Context(`test-${new Date().toISOString()}`);
    }
  }

  //not a static method because build returns an actual instance
  async close() {
    // Disconnect from PG
    await pool.close();

    //Reconnect as root user
    await pool.connect({ ...dbConfig, ...defConfig });

    //Delete the role and schema we created

    await pool.query(format("DROP SCHEMA %I CASCADE;", this.roleName));

    // Create a schema with the same name
    await pool.query(format("DROP ROLE %I;", this.roleName));

    //Disconnect
    await pool.close();
  }

  async reset() {
    //reset the db so that each test has fresh records
    // await pool.query(`
    // TRUNCATE TABLE users CASCADE;
    // TRUNCATE TABLE business CASCADE ;
    // `);
  }
}

export default Context;
