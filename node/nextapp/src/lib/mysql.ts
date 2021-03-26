import mysql from "mysql2/promise";

// 使用するデータベース
const db_option = {
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
}

// 問い合わせ
export async function excuteQuery(query: string, values: any) {
  try {
    const connection = await mysql.createConnection(db_option);
    const [rows] = await connection.execute(query, values);
    await connection.end();
    return rows;
  } catch (error) {
    return { error };
  }
}
