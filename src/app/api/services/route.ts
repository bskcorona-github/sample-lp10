import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient();

  try {
    // データベースからサービスを取得
    const services = await prisma.service.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("サービス取得エラー:", error);
    return NextResponse.json(
      { error: "サービスデータの取得に失敗しました" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
