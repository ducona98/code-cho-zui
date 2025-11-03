import { ErrorMessage, Field, Form, Formik } from "formik";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@components";
import { useGeolocation } from "@lib/hooks";
import {
  commonValidations,
  createValidationSchema,
} from "../../../../lib/utils/formValidation";
import {
  getDefaultProfile,
  getUserProfile,
  saveUserProfile,
  type Relative,
  type UserProfile,
} from "../../../../lib/utils/userProfile";

const profileSchema = createValidationSchema({
  name: commonValidations.required("Tên"),
  phoneNumber: commonValidations.phoneNumber,
  address: commonValidations.required("Địa chỉ"),
  radius: Yup.number()
    .min(1, "Bán kính tối thiểu 1km")
    .max(100, "Bán kính tối đa 100km")
    .required("Bán kính là bắt buộc"),
});

export function meta() {
  return [
    { title: "Cài đặt - Hệ thống cứu trợ thiên tai" },
    {
      name: "description",
      content: "Cài đặt thông tin cá nhân và cài đặt hệ thống",
    },
  ];
}

export default function Me() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const {
    position,
    error: geoError,
    loading: geoLoading,
    requestLocation,
  } = useGeolocation();
  const [relatives, setRelatives] = useState<Relative[]>([]);

  useEffect(() => {
    const savedProfile = getUserProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      setRelatives(savedProfile.relatives ?? []);
    } else {
      const defaultProfile = getDefaultProfile();
      setProfile(defaultProfile as UserProfile);
    }
  }, []);

  useEffect(() => {
    if (position) {
      setProfile((prev) => {
        if (!prev) return null;
        const updated = {
          ...prev,
          location: {
            latitude: position.latitude,
            longitude: position.longitude,
          },
        };
        saveUserProfile(updated);
        return updated;
      });
    }
  }, [position]);

  const handleSubmit = async (values: {
    name: string;
    phoneNumber: string;
    address: string;
    radius: number;
  }) => {
    const updatedProfile: UserProfile = {
      ...profile!,
      ...values,
      relatives,
      location: profile?.location,
    };
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
    alert("Đã lưu cài đặt thành công!");
  };

  const addRelative = () => {
    const newRelative: Relative = {
      id: Date.now().toString(),
      name: "",
      relationship: "",
      phoneNumber: "",
      address: "",
    };
    setRelatives([...relatives, newRelative]);
  };

  const updateRelative = (id: string, field: keyof Relative, value: string) => {
    setRelatives(
      relatives.map((rel) => (rel.id === id ? { ...rel, [field]: value } : rel))
    );
  };

  const removeRelative = (id: string) => {
    setRelatives(relatives.filter((rel) => rel.id !== id));
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Cài đặt</h1>

      <Formik
        initialValues={{
          name: profile.name || "",
          phoneNumber: profile.phoneNumber || "",
          address: profile.address || "",
          radius: profile.radius || 5,
        }}
        validationSchema={profileSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Cập nhật thông tin của bạn để nhận hỗ trợ tốt hơn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Tên</Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    placeholder="Nhập tên của bạn"
                    className={`mt-1 ${
                      touched.name && errors.name ? "border-destructive" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="text-sm text-destructive mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
                  <Field
                    as={Input}
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="0912345678"
                    className={`mt-1 ${
                      touched.phoneNumber && errors.phoneNumber
                        ? "border-destructive"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="p"
                    className="text-sm text-destructive mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Field
                    as={Input}
                    id="address"
                    name="address"
                    placeholder="Nhập địa chỉ của bạn"
                    className={`mt-1 ${
                      touched.address && errors.address
                        ? "border-destructive"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="address"
                    component="p"
                    className="text-sm text-destructive mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vị trí và bán kính</CardTitle>
                <CardDescription>
                  Cài đặt vị trí để xem các tin cứu trợ gần bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Vị trí hiện tại</Label>
                  <div className="mt-2 space-y-2">
                    {profile.location ? (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          ✓ Đã có vị trí
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Lat: {profile.location.latitude.toFixed(6)}, Lng:{" "}
                          {profile.location.longitude.toFixed(6)}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Chưa có vị trí
                        </p>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={requestLocation}
                      disabled={geoLoading}
                      className="w-full"
                    >
                      {geoLoading
                        ? "Đang lấy vị trí..."
                        : profile.location
                          ? "Cập nhật vị trí"
                          : "Lấy vị trí hiện tại"}
                    </Button>
                    {geoError && (
                      <p className="text-sm text-destructive">
                        Lỗi: {geoError.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Việc cung cấp vị trí là tùy chọn, bạn có thể nhập địa chỉ
                      thủ công ở trên.
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="radius">Bán kính hiển thị (km)</Label>
                  <Field
                    as={Input}
                    id="radius"
                    name="radius"
                    type="number"
                    min="1"
                    max="100"
                    className={`mt-1 ${
                      touched.radius && errors.radius
                        ? "border-destructive"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="radius"
                    component="p"
                    className="text-sm text-destructive mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Chỉ hiển thị các tin cứu trợ trong bán kính này
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin thân nhân</CardTitle>
                <CardDescription>
                  Thêm thông tin người thân để liên lạc trong trường hợp khẩn
                  cấp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatives.map((relative) => (
                  <motion.div
                    key={relative.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">
                        Thân nhân #{relative.id.slice(-4)}
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRelative(relative.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Tên</Label>
                        <Input
                          value={relative.name}
                          onChange={(e) =>
                            updateRelative(relative.id, "name", e.target.value)
                          }
                          placeholder="Tên thân nhân"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Quan hệ</Label>
                        <Input
                          value={relative.relationship}
                          onChange={(e) =>
                            updateRelative(
                              relative.id,
                              "relationship",
                              e.target.value
                            )
                          }
                          placeholder="Vợ/Chồng, Con, Bố/Mẹ..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Số điện thoại</Label>
                        <Input
                          value={relative.phoneNumber}
                          onChange={(e) =>
                            updateRelative(
                              relative.id,
                              "phoneNumber",
                              e.target.value
                            )
                          }
                          placeholder="0912345678"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Địa chỉ (tùy chọn)</Label>
                        <Input
                          value={relative.address || ""}
                          onChange={(e) =>
                            updateRelative(
                              relative.id,
                              "address",
                              e.target.value
                            )
                          }
                          placeholder="Địa chỉ"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Button type="button" variant="outline" onClick={addRelative}>
                  + Thêm thân nhân
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu cài đặt"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
