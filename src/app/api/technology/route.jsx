"use server";

import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await sql`SELECT * FROM stack;`;
    return new NextResponse(JSON.stringify(data.rows));
  } catch (error) {
    return new NextResponse(error);
  }
}
