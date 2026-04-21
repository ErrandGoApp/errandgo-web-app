import axios from "axios";
import type { AxiosResponse } from "axios";

export const BASE_URL = "";

export async function getRequest<T = any>(
  resource: string,
  query?: string,
  accessToken?: string
): Promise<T> {
  try {
    const url = !query?.trim()
      ? `${BASE_URL}/api/v2/${resource}`
      : `${BASE_URL}/api/v2/${resource}?${query}`;

    const res: AxiosResponse<any> = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res?.data?.data;
  } catch (error) {
    console.error("Get Request Error", error);
    throw error;
  }
}

export async function postRequest<T = any>(
  resource: string,
  body: any,
  accessToken = "",
  tenant = ""
): Promise<T | undefined> {
  let headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  if (tenant) headers.tenantId = tenant;

  const res = await axios.post(`${BASE_URL}/api/v2/${resource}`, body, {
    headers,
  });

  return res.data;
}
