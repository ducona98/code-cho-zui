/**
 * Service for fetching Vietnam administrative units from bando.com.vn APIs
 */

export interface Province {
  code: string;
  name: string;
}

export interface Ward {
  code: string;
  name: string;
  provinceCode?: string;
}

const PROVINCES_API = "https://sapnhap.bando.com.vn/pcotinh";
const WARDS_API = "https://sapnhap.bando.com.vn/ptracuu";

/**
 * Fetch all provinces/cities from API (POST method with FormData)
 */
export async function fetchProvinces(): Promise<Province[]> {
  try {
    const formData = new FormData();

    const response = await fetch(PROVINCES_API, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Handle different possible response structures
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id || "",
        code: item.code || item.mahc || "",
        name: item.name || item.ten || item.tentinh || "",
      }));
    }

    // If data has a nested structure
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((item: any) => ({
        id: item.id || "",
        code: item.code || item.mahc || "",
        name: item.name || item.ten || item.tentinh || "",
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return [];
  }
}

/**
 * Fetch wards/communes for a given province (POST method with FormData)
 * @param provinceCode - Province code to search for
 */
export async function fetchWards(provinceCode: string): Promise<Ward[]> {
  if (!provinceCode) {
    return [];
  }

  try {
    const formData = new FormData();
    formData.append("id", provinceCode);

    const response = await fetch(WARDS_API, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Handle different possible response structures
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id || "",
        code: item.code || item.ma || "",
        name:
          item.name ||
          (item.tenhc
            ? `${item.tenhc}${item.loai ? ` (${item.loai})` : ""}`
            : ""),
        provinceCode,
      }));
    }

    // If data has a nested structure
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((item: any) => ({
        id: item.id || "",
        code: item.code || item.ma || "",
        name:
          item.name ||
          (item.tenhc
            ? `${item.tenhc}${item.loai ? ` (${item.loai})` : ""}`
            : ""),
        provinceCode,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching wards:", error);
    return [];
  }
}
