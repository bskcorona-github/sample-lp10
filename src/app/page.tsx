"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ScrollAnimation from "../components/ScrollAnimation";
import Parallax from "../components/Parallax";

type Service = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  durationMinutes: number;
};

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // サービス一覧をAPIから取得
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services");
        if (!response.ok) {
          throw new Error("サービスデータの取得に失敗しました");
        }
        const data = await response.json();
        setServices(data);
        setError(null);
      } catch (err) {
        console.error("サービス取得エラー:", err);
        setError("サービスの読み込みに失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      {/* ヒーローセクション */}
      <section className="relative bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <ScrollAnimation
            initialVariant="slideLeft"
            className="md:w-1/2 mb-10 md:mb-0 md:pr-10"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              最高級の
              <span className="text-rose-600">美容体験</span>
              をあなたに
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              心地よい空間で、日常の喧騒から離れた贅沢なひとときを。プロフェッショナルによる最高品質のトリートメントで、美しさと癒しを提供します。
            </p>
            <Link
              href="/reservation"
              className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 px-8 rounded-md shadow-md transition duration-300"
            >
              今すぐ予約する
            </Link>
          </ScrollAnimation>
          <div className="md:w-1/2 relative">
            <Parallax speed={0.2} direction="up">
              <div
                className="h-64 md:h-96 w-full relative rounded-lg overflow-hidden shadow-xl"
                style={{
                  position: "relative",
                  backgroundImage: `url('/images/hero.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            </Parallax>
          </div>
        </div>
      </section>

      {/* サービス一覧セクション */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation
            initialVariant="fadeIn"
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              サービス一覧
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              当サロンでは、お客様のニーズに合わせた多彩なトリートメントをご用意しています。心身のリラクゼーションと美しさの向上を実現する上質なサービスをお楽しみください。
            </p>
          </ScrollAnimation>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">読み込み中...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-block bg-rose-600 text-white px-4 py-2 rounded-md"
              >
                再読み込み
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <ScrollAnimation
                  key={service.id}
                  initialVariant={index % 2 === 0 ? "slideLeft" : "slideRight"}
                  delay={index * 0.1}
                  className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="h-56 bg-gray-200 relative">
                    {/* 画像がある場合は表示、ない場合はプレースホルダー */}
                    {service.imageUrl ? (
                      <div className="w-full h-full relative">
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-rose-100">
                        <span className="text-rose-600">
                          {service.title}画像
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-rose-600">
                        ¥{service.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        所要時間: {service.durationMinutes}分
                      </span>
                    </div>
                    <Link
                      href="/reservation"
                      className="mt-4 inline-block bg-rose-100 hover:bg-rose-200 text-rose-700 font-medium py-2 px-4 rounded-md transition w-full text-center"
                    >
                      予約する
                    </Link>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ セクション */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation
            initialVariant="fadeIn"
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              よくある質問
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              お客様からよくいただくご質問にお答えします。さらにご不明な点がございましたら、お気軽にお問い合わせください。
            </p>
          </ScrollAnimation>

          <div className="space-y-6 max-w-3xl mx-auto">
            {/* FAQ項目1 */}
            <ScrollAnimation initialVariant="slideUp" delay={0.1}>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-lg font-medium text-gray-900">
                      予約のキャンセルはできますか？
                    </h3>
                    <span className="ml-6 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-gray-600">
                      ご予約のキャンセルは、予約日の2日前までであれば可能です。それ以降のキャンセルについては、キャンセル料が発生する場合がございますので、お早めにご連絡ください。
                    </p>
                  </div>
                </details>
              </div>
            </ScrollAnimation>

            {/* FAQ項目2 */}
            <ScrollAnimation initialVariant="slideUp" delay={0.2}>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-lg font-medium text-gray-900">
                      初めての方でも安心して利用できますか？
                    </h3>
                    <span className="ml-6 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-gray-600">
                      はい、もちろんです。初めてご利用のお客様には、カウンセリングを丁寧に行い、お客様のお肌の状態やご要望に合わせたトリートメントをご提案いたします。どのようなサービスが自分に合っているか分からない場合もお気軽にご相談ください。
                    </p>
                  </div>
                </details>
              </div>
            </ScrollAnimation>

            {/* FAQ項目3 */}
            <ScrollAnimation initialVariant="slideUp" delay={0.3}>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-lg font-medium text-gray-900">
                      支払い方法は何がありますか？
                    </h3>
                    <span className="ml-6 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-gray-600">
                      当サロンでは、クレジットカード（VISA、MasterCard、JCB、American
                      Express）、電子マネー、現金でのお支払いに対応しております。オンライン予約の場合は、Stripeを通じたクレジットカード決済が可能です。
                    </p>
                  </div>
                </details>
              </div>
            </ScrollAnimation>

            {/* FAQ項目4 */}
            <ScrollAnimation initialVariant="slideUp" delay={0.4}>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-lg font-medium text-gray-900">
                      どのような化粧品を使用していますか？
                    </h3>
                    <span className="ml-6 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-gray-600">
                      当サロンでは、オーガニック成分を中心とした高品質な化粧品を使用しています。パラベン、鉱物油、合成香料などを含まない製品を厳選し、敏感肌の方にも安心してご利用いただけるよう配慮しております。
                    </p>
                  </div>
                </details>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </>
  );
}
