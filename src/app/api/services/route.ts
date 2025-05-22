import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // データベースからサービスを取得
    const services = await prisma.service.findMany();

    return NextResponse.json(services);
  } catch (error) {
    console.error("サービス取得エラー:", error);
    return NextResponse.json(
      { error: "サービスの取得に失敗しました" },
      { status: 500 }
    );
  }
}
