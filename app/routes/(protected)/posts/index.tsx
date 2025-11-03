import { useLoaderData } from "react-router";

import { fetchProvinces } from "../../../../lib/services/vietnamAdministrative";
import type { Route } from "./+types/index";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  type SelectOption,
} from "@components";
import { ROUTES } from "@lib/constants/routes";
import { fetchWards, type Ward } from "@lib/services/vietnamAdministrative";
import { filterPosts, type Posts } from "@lib/utils/posts";
import { getUserProfile, saveUserProfile } from "@lib/utils/userProfile";

const RADIUS_OPTIONS: SelectOption[] = [
  { value: "1", label: "1 km" },
  { value: "3", label: "3 km" },
  { value: "5", label: "5 km" },
  { value: "10", label: "10 km" },
  { value: "20", label: "20 km" },
  { value: "50", label: "50 km" },
  { value: "100", label: "100 km" },
  { value: "0", label: "Tất cả" },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Trang chủ - Hệ thống cứu trợ thiên tai" },
    {
      name: "description",
      content: "Trang chủ hệ thống cứu trợ lũ lụt và thiên tai",
    },
  ];
}

/**
 * Client loader to fetch provinces data
 */
export async function clientLoader({}: Route.ClientLoaderArgs) {
  const provinces = await fetchProvinces();
  return { provinces };
}

export default function Posts() {
  const { provinces } = useLoaderData<typeof clientLoader>();

  const profile = getUserProfile();
  const defaultRadius = profile?.radius ?? 5;

  // State for administrative units
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>(
    profile?.provinceCode || ""
  );
  const [selectedWardCode, setSelectedWardCode] = useState<string>(
    profile?.wardCode || ""
  );
  const [selectedRadius, setSelectedRadius] = useState<string>(
    defaultRadius.toString()
  );
  const [loadingWards, setLoadingWards] = useState(false);

  // Set initial province from profile if exists
  useEffect(() => {
    if (profile?.provinceCode && provinces.length > 0) {
      const savedProvince = provinces.find(
        (p) => p.code === profile.provinceCode
      );
      if (savedProvince) {
        setSelectedProvinceCode(savedProvince.code);
      }
    }
  }, [provinces, profile?.provinceCode]);

  // Fetch wards when province changes
  useEffect(() => {
    async function loadWards() {
      if (!selectedProvinceCode) {
        setWards([]);
        // Only clear ward if province is being cleared (not on initial load)
        if (!selectedProvinceCode && profile?.provinceCode) {
          setSelectedWardCode("");
        }
        return;
      }

      try {
        setLoadingWards(true);
        const data = await fetchWards(selectedProvinceCode);
        setWards(data);

        // If user has saved ward in this province, try to find it
        if (
          profile?.wardCode &&
          profile?.provinceCode === selectedProvinceCode
        ) {
          const savedWard = data.find((w) => w.code === profile.wardCode);
          if (savedWard) {
            setSelectedWardCode(savedWard.code);
          } else {
            setSelectedWardCode("");
          }
        } else if (profile?.provinceCode !== selectedProvinceCode) {
          // Province changed, clear ward
          setSelectedWardCode("");
        }
      } catch (error) {
        console.error("Error loading wards:", error);
        setWards([]);
      } finally {
        setLoadingWards(false);
      }
    }
    loadWards();
  }, [selectedProvinceCode]);

  // Save filter preferences when they change
  useEffect(() => {
    const selectedProvince = provinces.find(
      (p) => p.code === selectedProvinceCode
    );
    const selectedWard = wards.find((w) => w.code === selectedWardCode);
    const radius = parseInt(selectedRadius) || 0;

    if (
      selectedProvinceCode !== profile?.provinceCode ||
      selectedWardCode !== profile?.wardCode ||
      radius !== profile?.radius
    ) {
      saveUserProfile({
        provinceCode: selectedProvinceCode || undefined,
        provinceName: selectedProvince?.name || undefined,
        wardCode: selectedWardCode || undefined,
        wardName: selectedWard?.name || undefined,
        radius: radius || defaultRadius,
      });
    }
  }, [
    selectedProvinceCode,
    selectedWardCode,
    selectedRadius,
    provinces,
    wards,
  ]);

  // Filter posts
  const selectedProvince = provinces.find(
    (p) => p.code === selectedProvinceCode
  );
  const selectedWard = wards.find((w) => w.code === selectedWardCode);
  const radius = parseInt(selectedRadius) || 0;

  const posts = filterPosts({
    userLocation: profile?.location || null,
    radius: radius > 0 ? radius : undefined,
    provinceName: selectedProvince?.name,
    wardName: selectedWard?.name,
  });

  const provinceOptions: SelectOption[] = provinces.map((p) => ({
    value: p.code,
    label: p.name,
  }));

  const wardOptions: SelectOption[] = wards.map((w) => ({
    value: w.code,
    label: w.name,
  }));

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

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tin cứu trợ</h1>
          <p className="text-muted-foreground">
            {radius > 0 ? `Bán kính hiển thị: ${radius}km` : "Hiển thị tất cả"}
            {!profile?.location && radius > 0 && (
              <span className="text-orange-600 ml-2">
                (Chưa có vị trí, chỉ lọc theo địa giới hành chính)
              </span>
            )}
          </p>
        </div>
        <Link to={ROUTES.ME}>
          <Button variant="outline">Cài đặt</Button>
        </Link>
      </div>

      {/* Filter Section */}
      <div className="bg-card border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Tỉnh/Thành phố
            </label>
            <Select
              options={provinceOptions}
              placeholder="Chọn tỉnh/thành phố"
              value={selectedProvinceCode}
              onChange={(e) => setSelectedProvinceCode(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phường/Xã</label>
            <Select
              options={wardOptions}
              placeholder={
                selectedProvinceCode
                  ? loadingWards
                    ? "Đang tải..."
                    : "Chọn phường/xã"
                  : "Chọn tỉnh trước"
              }
              value={selectedWardCode}
              onChange={(e) => setSelectedWardCode(e.target.value)}
              disabled={!selectedProvinceCode || loadingWards}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bán kính</label>
            <Select
              options={RADIUS_OPTIONS}
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(e.target.value)}
            />
          </div>
        </div>
        {(selectedProvinceCode || selectedWardCode || radius > 0) && (
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedProvinceCode("");
                setSelectedWardCode("");
                setSelectedRadius(defaultRadius.toString());
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <Button>+ Đăng tin cứu trợ</Button>
        <div className="text-sm text-muted-foreground">
          Tìm thấy {posts.length} tin cứu trợ
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: Posts, index: number) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle
                    className="text-lg pr-2 line-clamp-2"
                    title={post.title}
                  >
                    {post.title}
                  </CardTitle>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getUrgencyColor(
                      post.urgency
                    )}`}
                  >
                    {getUrgencyText(post.urgency)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 gap-4">
                <div className="flex flex-col justify-between flex-1">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-muted-foreground"
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
                      <span className="text-muted-foreground">
                        {post.location.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-muted-foreground"
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
                        className="text-primary hover:underline"
                      >
                        {post.contactPhone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                      {formatTimeAgo(post.postedAt)}
                    </div>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t">
                  <Link to={`/posts/${post.id}`} className="block">
                    <Button className="w-full" variant="outline" size="sm">
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy tin cứu trợ nào phù hợp với bộ lọc
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedProvinceCode("");
              setSelectedWardCode("");
              setSelectedRadius(defaultRadius.toString());
            }}
          >
            Xóa bộ lọc
          </Button>
        </div>
      )}
    </main>
  );
}
