import { motion } from "framer-motion";
import { Link, redirect, useParams } from "react-router";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@components";
import { ROUTES } from "@lib/constants/routes";
import { getPostById, type Posts } from "@lib/utils/posts";
import type { Route } from "./+types/index";

export function meta({ data }: Route.MetaArgs) {
  const post = data as Posts | null;
  return [
    {
      title: post
        ? `${post.title} - Hệ thống cứu trợ thiên tai`
        : "Bài đăng không tồn tại",
    },
    {
      name: "description",
      content: post?.description || "Chi tiết bài đăng cứu trợ",
    },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const post = getPostById(params.id);
  if (!post) {
    // Redirect to home if post not found
    return redirect(ROUTES.HOME);
  }
  return post;
}

export default function PostDetail() {
  const params = useParams<{ id: string }>();
  const post = getPostById(params.id || "");

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Bài đăng không tồn tại</h2>
            <Link to={ROUTES.HOME}>
              <Button>Quay về trang chủ</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "Khẩn cấp";
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-500 text-white";
      case "cancelled":
        return "bg-gray-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "resolved":
        return "Đã giải quyết";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Đang cần hỗ trợ";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    return `${minutes} phút trước`;
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link to={ROUTES.HOME}>
          <Button variant="ghost" className="mb-4">
            ← Quay lại
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-4">
              <CardTitle className="text-2xl flex-1">{post.title}</CardTitle>
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold whitespace-nowrap ${getUrgencyColor(
                    post.urgency
                  )}`}
                >
                  {getUrgencyText(post.urgency)}
                </span>
                {post.status && (
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold whitespace-nowrap ${getStatusColor(
                      post.status
                    )}`}
                  >
                    {getStatusText(post.status)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatTimeAgo(post.postedAt)} ({formatDateTime(post.postedAt)})
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Mô tả chi tiết</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {post.fullDescription || post.description}
              </p>
            </div>

            {/* Location */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Vị trí</h3>
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-primary mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <p className="font-medium">{post.location.address}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tọa độ: {post.location.latitude.toFixed(6)},{" "}
                    {post.location.longitude.toFixed(6)}
                  </p>
                  <a
                    href={`https://maps.google.com/?q=${post.location.latitude},${post.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-2 inline-block"
                  >
                    Xem trên bản đồ →
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Thông tin liên hệ</h3>
              <div className="space-y-2">
                {post.contactName && (
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>{post.contactName}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a
                    href={`tel:${post.contactPhone}`}
                    className="text-lg font-semibold text-primary hover:underline"
                  >
                    {post.contactPhone}
                  </a>
                </div>
                <div className="mt-4">
                  <a href={`tel:${post.contactPhone}`}>
                    <Button className="w-full sm:w-auto" size="lg">
                      Gọi ngay
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Needs */}
            {post.needs && post.needs.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">
                  Cần hỗ trợ (ưu tiên)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.needs.map((need, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                    >
                      {need}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="border-t pt-4 flex gap-3">
              <a href={`tel:${post.contactPhone}`} className="flex-1">
                <Button className="w-full" size="lg">
                  Gọi điện hỗ trợ
                </Button>
              </a>
              <Link to={ROUTES.HOME} className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  Xem tin khác
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
