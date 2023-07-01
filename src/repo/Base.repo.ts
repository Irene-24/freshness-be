import pool from "@/src/db";

abstract class BaseRespoitory {
  async query(sql: string) {
    return await pool.query(sql);
  }

  abstract create(body: any): any;
  abstract update(...body: any): any;
  abstract findById(id: string): any;
  abstract delete(id: string): any;
}

export default BaseRespoitory;
