import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // クエリパラメータから日付とサービスIDを取得
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get("date");
    const serviceIdParam = searchParams.get("serviceId");

    if (!dateParam || !serviceIdParam) {
      return NextResponse.json(
        { error: "日付とサービスIDは必須です" },
        { status: 400 }
      );
    }

    // 日付とサービスIDをパース
    const date = new Date(dateParam);
    // JavaScriptのDateは時差があるため、UTC日付に調整
    date.setUTCHours(0, 0, 0, 0);
    const serviceId = parseInt(serviceIdParam, 10);

    // データベースからタイムスロットを取得
    const timeSlots = await prisma.timeSlot.findMany({
      where: {
        date: date,
        serviceId: serviceId,
      },
    });

    // クライアント向けにデータを整形
    const formattedTimeSlots = timeSlots.map((slot) => ({
      id: slot.id,
      timeSlot: slot.timeSlot,
      available: slot.currentReservations < slot.maxCapacity,
    }));

    return NextResponse.json(formattedTimeSlots);
  } catch (error) {
    console.error("タイムスロット取得エラー:", error);
    return NextResponse.json(
      { error: "タイムスロットの取得に失敗しました" },
      { status: 500 }
    );
  }
}
