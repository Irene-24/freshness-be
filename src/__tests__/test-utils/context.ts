import { randomBytes } from "crypto";
import format from "pg-format";
import { default as migrate } from "node-pg-migrate";
import pool from "@/src/db";
import config from "@/src/config";

const { dbConfig } = config;

class Context {
  roleName: string;

  constructor(name: string) {
    this.roleName = name;
  }

  static async build() {
    // Randomly generating a role name to connect to PG as
    const roleName = "freshness" + randomBytes(4).toString("hex");

    await pool.connect(dbConfig);

    // Create a new role
    //make it super user else we get error: permission denied to create extension "uuid-ossp"
    await pool.query(
      format("CREATE ROLE %I SUPERUSER LOGIN PASSWORD %L;", roleName, roleName)
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
  }

  //not a static method because build returns an actual instance
  async close() {
    // Disconnect from PG
    await pool.close();

    //Reconnect as root user
    await pool.connect(dbConfig);

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
    // DROP TABLE users;
    // DROP TABLE business;
    // `);
  }
}

export default Context;
