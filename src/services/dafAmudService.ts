import axiosInstance from './api';

export interface AmudMapping {
  chapter: string;
  halacha: string;
  system_line: string;
}

export interface leanDaf {
  id: string;  // Hebrew letter (ב, ג, ד...)
  amudim: string[];  // Array of amud values (א, ב)
}

/**
 * Get the mapping for a specific Daf/Amud combination
 */
export async function getDafAmudMapping(
  tractate: string,
  daf: string,
  amud: string,
): Promise<AmudMapping | null> {
  try {
    const response = await axiosInstance.get(
      `/navigation/daf-amud/${tractate}/${daf}/${amud}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching Daf/Amud mapping:', error);
    return null;
  }
}

/**
 * Get all Dafs for a tractate
 */
export async function getAllDafsForTractate(
  tractate: string,
): Promise<leanDaf[]> {
  try {
    const response = await axiosInstance.get(`/navigation/dafs/${tractate}`);
    const dafs: string[] = response.data.dafs || [];
    
    // For each daf, we need to fetch its amudim
    const dafList: leanDaf[] = await Promise.all(
      dafs.map(async (dafId) => {
        const amudimsResponse = await axiosInstance.get(
          `/navigation/amudim/${tractate}/${dafId}`,
        );
        return {
          id: dafId,
          amudim: amudimsResponse.data.amudim || [],
        };
      }),
    );
    
    return dafList;
  } catch (error) {
    console.error('Error fetching Dafs for tractate:', error);
    return [];
  }
}

/**
 * Get all Amudim for a specific Daf
 */
export async function getAmudimsForDaf(
  tractate: string,
  daf: string,
): Promise<string[]> {
  try {
    const response = await axiosInstance.get(
      `/navigation/amudim/${tractate}/${daf}`,
    );
    return response.data.amudim || [];
  } catch (error) {
    console.error('Error fetching Amudim for Daf:', error);
    return [];
  }
}
