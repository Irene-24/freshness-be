import pg, { Pool, PoolConfig, QueryConfig } from "pg";

class AppPool {
  protected pool: Pool | null = null;

  connect(options?: PoolConfig): Promise<any> {
    try {
      this.pool = new pg.Pool(options);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    }
  }

  close() {
    if (this.pool) {
      return this.pool.end();
    } else {
      this.error();
    }
  }

  query(sql: string | QueryConfig, params?: any) {
    if (this.pool) {
      return this.pool.query(sql, params);
    } else {
      this.error();
    }
  }

  error() {
    throw new Error(
      "There is no existing pool. Ensure that you have called '.connect()' first"
    );
  }
}

const pool = new AppPool();

export default pool;
