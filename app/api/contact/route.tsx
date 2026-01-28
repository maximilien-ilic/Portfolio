import { NextResponse } from "next/server";
import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";

// Instance globale de la base de données
let db: Database | null = null;

async function getDb() {
  if (!db) {
    // Chemin vers le fichier portfolio.db à la racine du projet parent
    const dbPath = path.join(process.cwd(), "..", "portfolio.db");
    
    console.log("Opening database at:", dbPath);

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    
    console.log("Database opened successfully");
  }
  return db;
}

export async function POST(req: Request) {
  try {
    // Get body request
    const body = await req.json();
    const { firstname, lastname, email, password } = body;

    // Validation
    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Call Contact function
    const response = await Contact(firstname, lastname, email, password);

    // If user already exists
    if (response === false) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "User created successfully", userId: response },
      { status: 201 }
    );

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}

async function Contact(
  firstname: string,
  lastname: string,
  email: string,
  password: string
) {
  try {
    const database = await getDb();

    // Verify that the user does not exist yet
    const verif = `SELECT email FROM users WHERE email = ?`;
    const userVerif = await database.get(verif, email);

    if (userVerif) {
      return false;
    }

    // Insert the new user (use db.run() not db.get() for INSERT)
    const sql = `INSERT INTO users (firstname, lastname, email, pwd) VALUES (?, ?, ?, ?)`;
    const result = await database.run(sql, firstname, lastname, email, password);

    // Return the ID of the new user
    return result.lastID;

  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  }
}