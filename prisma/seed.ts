import { PrismaClient } from "@prisma/client";
import { addDays, format } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  // サービスデータを作成
  const services = [
    {
      title: "プレミアムフェイシャル",
      description:
        "高品質な美容成分を使用した贅沢なフェイシャルトリートメント。肌に輝きを与え、若々しさを取り戻します。",
      imageUrl: "/images/services/facial.jpg",
      price: 12000,
      durationMinutes: 60,
    },
    {
      title: "ヘッドスパ",
      description:
        "心地よいマッサージと高品質なヘアケア製品を使用したリラックスできるヘッドスパ。頭皮環境を整え、美しい髪へ導きます。",
      imageUrl: "/images/services/headspa.jpg",
      price: 8000,
      durationMinutes: 45,
    },
    {
      title: "アロマボディマッサージ",
      description:
        "厳選されたエッセンシャルオイルを使用した全身マッサージ。深いリラクゼーションと心身のバランスを整えます。",
      imageUrl: "/images/services/massage.jpg",
      price: 15000,
      durationMinutes: 90,
    },
    {
      title: "ハンド＆フットケア",
      description:
        "手と足のためのプロフェッショナルケア。ネイルケアと保湿トリートメントで美しい手足を実現します。",
      imageUrl: "/images/services/hand-foot.jpg",
      price: 7000,
      durationMinutes: 60,
    },
  ];

  // サービスをデータベースに登録
  for (const service of services) {
    await prisma.service.create({
      data: service,
    });
  }

  // サービスIDを取得
  const allServices = await prisma.service.findMany();

  // 今日から14日分のタイムスロットを作成
  const timeSlots = [
    "10:00-11:00",
    "11:30-12:30",
    "13:00-14:00",
    "14:30-15:30",
    "16:00-17:00",
    "17:30-18:30",
  ];

  for (let i = 0; i < 14; i++) {
    const currentDate = addDays(new Date(), i);
    const formattedDate = format(currentDate, "yyyy-MM-dd");

    for (const service of allServices) {
      for (const slot of timeSlots) {
        await prisma.timeSlot.create({
          data: {
            date: new Date(formattedDate),
            timeSlot: slot,
            serviceId: service.id,
            maxCapacity: 1,
            currentReservations: 0,
          },
        });
      }
    }
  }

  console.log("シードデータが正常に追加されました");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
