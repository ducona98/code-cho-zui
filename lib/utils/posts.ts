/**
 * Utility functions for rescue posts
 * Manages mock data and operations for rescue posts
 */

export interface Posts {
  id: string;
  title: string;
  description: string;
  fullDescription?: string; // Full detailed description
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  urgency: "low" | "medium" | "high" | "critical";
  postedAt: Date;
  contactPhone: string;
  contactName?: string;
  needs: string[]; // List of needed items/help
  status?: "active" | "resolved" | "cancelled";
}

// Mock data - replace with API calls
export const mockPosts: Posts[] = [
  {
    id: "1",
    title: "Cần cứu trợ khẩn cấp - Ngập lụt khu vực Đông Anh",
    description:
      "Khu vực phường Đông Anh đang bị ngập sâu, nhiều hộ dân cần được di tản khẩn cấp. Cần hỗ trợ thuyền và áo phao.",
    fullDescription:
      "Khu vực phường Đông Anh hiện đang chịu ảnh hưởng nặng nề của trận lũ lụt lịch sử. Mực nước dâng cao tới 2-3 mét, khiến hàng trăm hộ dân bị cô lập. Nhiều gia đình đang mắc kẹt trên tầng 2, tầng 3 của nhà. Chúng tôi cần được hỗ trợ:\n\n- Thuyền cứu hộ và áo phao để di tản người dân\n- Thực phẩm, nước uống và thuốc men khẩn cấp\n- Quần áo ấm và chăn màn\n- Đèn pin và pin dự phòng\n\nXin cảm ơn sự hỗ trợ của mọi người!",
    location: {
      latitude: 21.1234,
      longitude: 105.5678,
      address: "Phường Đông Anh, Quận Đông Anh, Hà Nội",
    },
    urgency: "critical",
    postedAt: new Date(Date.now() - 30 * 60 * 1000),
    contactPhone: "0912345678",
    contactName: "Nguyễn Văn A",
    needs: ["Thuyền cứu hộ", "Áo phao", "Thực phẩm", "Nước uống", "Thuốc men"],
    status: "active",
  },
  {
    id: "2",
    title: "Cần lương thực và nước uống",
    description:
      "Xã Mỹ Đức đang thiếu nước uống và lương thực. Cần hỗ trợ gấp.",
    fullDescription:
      "Xã Mỹ Đức đã bị cô lập hoàn toàn do ngập lụt. Tất cả đường đi đều bị ngập, không thể di chuyển bằng xe. Hiện tại có khoảng 500 hộ dân đang cần được hỗ trợ:\n\n- Lương thực: Gạo, mì tôm, đồ hộp\n- Nước uống: Nước đóng chai (cần gấp)\n- Dầu ăn, muối, đường\n- Bình gas mini để nấu ăn\n- Pin và đèn pin\n\nCó thể gửi hỗ trợ qua đường thủy hoặc máy bay trực thăng.",
    location: {
      latitude: 21.2234,
      longitude: 105.6678,
      address: "Xã Mỹ Đức, Huyện Mỹ Đức, Hà Nội",
    },
    urgency: "high",
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    contactPhone: "0987654321",
    contactName: "Trần Thị B",
    needs: ["Gạo", "Nước uống", "Mì tôm", "Đồ hộp", "Dầu ăn"],
    status: "active",
  },
  {
    id: "3",
    title: "Cần hỗ trợ y tế - Nhiều người bị thương",
    description:
      "Nhiều người dân bị thương trong quá trình di tản, cần hỗ trợ y tế khẩn cấp.",
    fullDescription:
      "Trong quá trình di tản khỏi khu vực ngập lụt, nhiều người dân đã bị thương do va chạm, trượt ngã. Hiện tại có:\n\n- 5 người bị thương nặng, cần đưa đi bệnh viện\n- 15 người bị thương nhẹ, cần băng bó, thuốc men\n- Nhiều người già và trẻ em cần được chăm sóc đặc biệt\n\nCần hỗ trợ:\n- Bác sĩ, y tá tình nguyện\n- Thuốc giảm đau, kháng sinh\n- Băng gạc y tế\n- Cáng cứu thương\n- Xe cứu thương hoặc phương tiện di chuyển",
    location: {
      latitude: 21.1534,
      longitude: 105.5878,
      address: "Phường Trung Hòa, Quận Cầu Giấy, Hà Nội",
    },
    urgency: "critical",
    postedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    contactPhone: "0934567890",
    contactName: "Lê Văn C",
    needs: [
      "Bác sĩ",
      "Thuốc men",
      "Băng gạc",
      "Cáng cứu thương",
      "Xe cứu thương",
    ],
    status: "active",
  },
];

/**
 * Get post by ID
 * @param id - Post ID
 * @returns Posts or null if not found
 */
export function getPostById(id: string): Posts | null {
  const post = mockPosts.find((p) => p.id === id);
  return post || null;
}

/**
 * Get all posts
 * @returns Array of Posts
 */
export function getAllPosts(): Posts[] {
  return mockPosts;
}

/**
 * Filter posts by location and radius
 * @param userLocation - User's location
 * @param radius - Radius in kilometers
 * @returns Filtered array of posts
 */
export function filterPostsByLocation(
  userLocation: { latitude: number; longitude: number } | null,
  radius: number
): Posts[] {
  if (!userLocation) {
    return mockPosts; // Return all if no location
  }

  return mockPosts.filter((post) => {
    const distance = calculateDistance(userLocation, post.location);
    return distance <= radius;
  });
}

/**
 * Filter posts by administrative unit (province and ward)
 * @param provinceName - Province name to filter (optional)
 * @param wardName - Ward name to filter (optional)
 * @returns Filtered array of posts
 */
export function filterPostsByAdministrative(
  provinceName?: string,
  wardName?: string
): Posts[] {
  if (!provinceName && !wardName) {
    return mockPosts; // Return all if no filter
  }

  return mockPosts.filter((post) => {
    const address = post.location.address.toLowerCase();

    // Filter by province if provided
    if (provinceName) {
      const provinceMatch = address.includes(provinceName.toLowerCase());
      if (!provinceMatch) {
        return false;
      }
    }

    // Filter by ward if provided
    if (wardName) {
      const wardMatch = address.includes(wardName.toLowerCase());
      if (!wardMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Filter posts by multiple criteria (location/radius and administrative unit)
 * @param options - Filter options
 * @returns Filtered array of posts
 */
export function filterPosts(options: {
  userLocation?: { latitude: number; longitude: number } | null;
  radius?: number;
  provinceName?: string;
  wardName?: string;
}): Posts[] {
  const { userLocation, radius, provinceName, wardName } = options;

  let filtered = mockPosts;

  // First filter by administrative unit (province/ward)
  if (provinceName || wardName) {
    filtered = filterPostsByAdministrative(provinceName, wardName);
  }

  // Then filter by location and radius if provided
  if (userLocation && radius) {
    filtered = filtered.filter((post) => {
      const distance = calculateDistance(userLocation, post.location);
      return distance <= radius;
    });
  }

  return filtered;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param location1 - First location
 * @param location2 - Second location
 * @returns Distance in kilometers
 */
function calculateDistance(
  location1: { latitude: number; longitude: number },
  location2: { latitude: number; longitude: number }
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((location2.latitude - location1.latitude) * Math.PI) / 180;
  const dLon = ((location2.longitude - location1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((location1.latitude * Math.PI) / 180) *
      Math.cos((location2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}
