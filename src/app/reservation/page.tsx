"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Service = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  durationMinutes: number;
};

type TimeSlot = {
  id: number;
  timeSlot: string;
  available: boolean;
};

const Reservation = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // フォームデータ
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // サービス一覧をAPIから取得
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/services");
        if (!response.ok) {
          throw new Error("サービスデータの取得に失敗しました");
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error("サービス取得エラー:", err);
        setError(
          "サービスの読み込みに失敗しました。しばらくしてから再度お試しください。"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // 選択された日付に基づいて利用可能な時間枠を取得
  useEffect(() => {
    if (selectedDate && selectedService) {
      const fetchTimeSlots = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // 日付をISO形式に変換 (YYYY-MM-DD)
          const formattedDate = selectedDate.toISOString().split("T")[0];

          const response = await fetch(
            `/api/timeslots?date=${formattedDate}&serviceId=${selectedService.id}`
          );
          if (!response.ok) {
            throw new Error("タイムスロットの取得に失敗しました");
          }
          const data = await response.json();
          setAvailableTimeSlots(data);
        } catch (err) {
          console.error("タイムスロット取得エラー:", err);
          setError(
            "時間枠の読み込みに失敗しました。しばらくしてから再度お試しください。"
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchTimeSlots();
    } else {
      setAvailableTimeSlots([]);
    }
  }, [selectedDate, selectedService]);

  // 入力フォームの変更ハンドラー
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // サービス選択ハンドラー
  const handleServiceSelection = (service: Service) => {
    setSelectedService(service);
    setSelectedTimeSlot(null);
    setFormStep(2);
  };

  // 日時選択ハンドラー
  const handleDateTimeSelection = () => {
    if (selectedTimeSlot) {
      setFormStep(3);
    }
  };

  // 予約確定ハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!selectedService || !selectedDate || !selectedTimeSlot) {
      setError("予約情報が不完全です。もう一度ご確認ください。");
      setIsLoading(false);
      return;
    }

    try {
      // 日付をISO形式に変換 (YYYY-MM-DD)
      const formattedDate = selectedDate.toISOString().split("T")[0];

      // 予約データを作成
      const reservationData = {
        serviceId: selectedService.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formattedDate,
        timeSlot: selectedTimeSlot,
      };

      // APIに予約データを送信
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "予約の作成に失敗しました");
      }

      // 予約が成功したら予約完了ページへ
      setFormStep(4);
    } catch (err: unknown) {
      console.error("予約送信エラー:", err);
      setError(
        err instanceof Error
          ? err.message
          : "予約の処理中にエラーが発生しました。しばらくしてから再度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Link
            href="/"
            className="text-rose-600 hover:text-rose-700 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            ホームに戻る
          </Link>
        </div>

        {/* エラーメッセージ表示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* ステップインジケーター */}
          <div className="bg-gray-50 border-b">
            <div className="px-6 py-4">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    formStep >= 1
                      ? "bg-rose-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <div
                  className={`h-1 flex-1 mx-2 ${
                    formStep >= 2 ? "bg-rose-600" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    formStep >= 2
                      ? "bg-rose-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <div
                  className={`h-1 flex-1 mx-2 ${
                    formStep >= 3 ? "bg-rose-600" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    formStep >= 3
                      ? "bg-rose-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  3
                </div>
                <div
                  className={`h-1 flex-1 mx-2 ${
                    formStep >= 4 ? "bg-rose-600" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    formStep >= 4
                      ? "bg-rose-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  4
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>サービス選択</span>
                <span>日時選択</span>
                <span>お客様情報</span>
                <span>完了</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* ステップ1: サービス選択 */}
            {formStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  サービスを選択
                </h2>

                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">読み込み中...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedService?.id === service.id
                            ? "border-rose-600 bg-rose-50"
                            : "border-gray-200 hover:border-rose-300"
                        }`}
                        onClick={() => handleServiceSelection(service)}
                      >
                        <h3 className="text-lg font-semibold text-gray-900">
                          {service.title}
                        </h3>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-rose-600 font-medium">
                            ¥{service.price.toLocaleString()}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {service.durationMinutes}分
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ステップ2: 日時選択 */}
            {formStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  日時を選択
                </h2>

                {selectedService && (
                  <div className="mb-6 p-4 bg-rose-50 rounded-lg">
                    <p className="text-gray-700">
                      選択中のサービス:{" "}
                      <span className="font-semibold">
                        {selectedService.title}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      料金:{" "}
                      <span className="font-semibold text-rose-600">
                        ¥{selectedService.price.toLocaleString()}
                      </span>
                    </p>
                  </div>
                )}

                <div className="mb-8">
                  <label className="block text-gray-700 mb-2">日付</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    minDate={new Date()}
                    inline
                    className="w-full"
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-gray-700 mb-2">時間</label>
                  {isLoading ? (
                    <p className="text-gray-500">時間枠を読み込み中...</p>
                  ) : availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {availableTimeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          className={`py-2 px-4 rounded-md text-center ${
                            !slot.available
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : selectedTimeSlot === slot.timeSlot
                              ? "bg-rose-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:border-rose-300"
                          }`}
                          disabled={!slot.available}
                          onClick={() => setSelectedTimeSlot(slot.timeSlot)}
                        >
                          {slot.timeSlot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      {selectedDate
                        ? "選択した日付の時間枠はありません"
                        : "日付を選択してください"}
                    </p>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setFormStep(1)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    戻る
                  </button>
                  <button
                    onClick={handleDateTimeSelection}
                    disabled={!selectedTimeSlot || isLoading}
                    className={`px-6 py-2 rounded-md ${
                      selectedTimeSlot && !isLoading
                        ? "bg-rose-600 text-white hover:bg-rose-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    次へ
                  </button>
                </div>
              </div>
            )}

            {/* ステップ3: お客様情報 */}
            {formStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  お客様情報
                </h2>

                {selectedService && selectedDate && selectedTimeSlot && (
                  <div className="mb-6 p-4 bg-rose-50 rounded-lg">
                    <p className="text-gray-700">
                      サービス:{" "}
                      <span className="font-semibold">
                        {selectedService.title}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      日時:{" "}
                      <span className="font-semibold">
                        {format(selectedDate, "yyyy年MM月dd日")}{" "}
                        {selectedTimeSlot}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      料金:{" "}
                      <span className="font-semibold text-rose-600">
                        ¥{selectedService.price.toLocaleString()}
                      </span>
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 mb-2">
                      お名前
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-black"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">
                      メールアドレス
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-black"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-gray-700 mb-2">
                      電話番号
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-black"
                    />
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      disabled={isLoading}
                    >
                      戻る
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:bg-gray-400"
                      disabled={isLoading}
                    >
                      {isLoading ? "送信中..." : "予約を確定する"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ステップ4: 完了 */}
            {formStep === 4 && (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  予約が完了しました
                </h2>
                <p className="text-gray-600 mb-8">
                  予約確認メールをお送りしました。ご来店をお待ちしております。
                </p>
                <Link
                  href="/"
                  className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-6 rounded-md"
                >
                  ホームに戻る
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
