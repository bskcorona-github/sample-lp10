import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, name, email, phone, date, timeSlot } = body;

    // 必須フィールドのバリデーション
    if (!serviceId || !name || !email || !phone || !date || !timeSlot) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています" },
        { status: 400 }
      );
    }

    // サービスの存在確認
    const service = await prisma.service.findUnique({
      where: { id: Number(serviceId) },
    });

    if (!service) {
      return NextResponse.json(
        { error: "指定されたサービスが見つかりません" },
        { status: 404 }
      );
    }

    // 日付を正しく処理
    const dateObj = new Date(date);
    // JavaScriptのDateは時差があるため、UTC日付に調整
    dateObj.setUTCHours(0, 0, 0, 0);

    // タイムスロットの利用可能性チェック
    const timeSlotRecord = await prisma.timeSlot.findFirst({
      where: {
        serviceId: Number(serviceId),
        date: dateObj,
        timeSlot: timeSlot,
      },
    });

    if (!timeSlotRecord) {
      return NextResponse.json(
        { error: "指定された日時のタイムスロットが見つかりません" },
        { status: 404 }
      );
    }

    if (timeSlotRecord.currentReservations >= timeSlotRecord.maxCapacity) {
      return NextResponse.json(
        { error: "選択されたタイムスロットは既に予約でいっぱいです" },
        { status: 400 }
      );
    }

    // トランザクションを使用して予約を保存し、タイムスロットのカウンターを更新
    const reservation = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // 予約を作成
        const newReservation = await tx.reservation.create({
          data: {
            serviceId: Number(serviceId),
            name,
            email,
            phone,
            date: dateObj,
            timeSlot,
            paymentStatus: "pending",
          },
        });

        // タイムスロットの予約数を更新
        await tx.timeSlot.update({
          where: { id: timeSlotRecord.id },
          data: {
            currentReservations: timeSlotRecord.currentReservations + 1,
          },
        });

        return newReservation;
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "予約が正常に作成されました",
        reservationId: reservation.id,
        data: {
          service: service,
          customer: { name, email, phone },
          date: dateObj,
          timeSlot,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("予約作成エラー:", error);
    return NextResponse.json(
      { error: "予約の作成に失敗しました" },
      { status: 500 }
    );
  }
}
