import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Admin credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    // Check if admin user already exists
    const existingUser = await users.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingUser) {
      return NextResponse.json(
        { message: "Admin user already exists" },
        { status: 200 }
      );
    }

    // Create admin user
    const hashedPassword = await hash(process.env.ADMIN_PASSWORD, 12);
    await users.insertOne({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      name: "Admin",
    });

    return NextResponse.json(
      { message: "Admin user created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error setting up admin user:", error);
    return NextResponse.json(
      { error: "Failed to setup admin user" },
      { status: 500 }
    );
  }
}