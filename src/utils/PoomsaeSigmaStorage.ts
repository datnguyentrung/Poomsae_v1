import type { SigmaData } from '@/types/types';

// Class quản lý lưu trữ PoomsaeSigma vào localStorage
export class PoomsaeSigmaLocalStorage {
    // Prefix để phân biệt các key
    private static readonly PREFIX = 'poomsae_sigma_';
    // Key chứa danh sách tất cả key đã lưu
    private static readonly KEYS_LIST = 'poomsae_sigma_keys';

    // Cache toàn bộ data đã load (tránh đọc localStorage nhiều lần)
    private static cache: { participants: number; data: SigmaData[] }[] | null = null;
    // Index map để lookup nhanh theo childNodeId
    private static index: Map<number, SigmaData> | null = null;

    // Lưu data cho một số participants cụ thể
    static save(participants: number, data: SigmaData[]): void {
        const key = `${this.PREFIX}${participants}`;
        localStorage.setItem(key, JSON.stringify(data));
        this.updateKeysList(key);

        // Khi lưu -> reset cache và index vì data thay đổi
        this.cache = null;
        this.index = null;
    }

    // Lấy data cho một participants (trả về mảng SigmaData hoặc null nếu chưa có)
    static get(participants: number): SigmaData[] | null {
        const key = `${this.PREFIX}${participants}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    // Xóa data cho một participants
    static remove(participants: number): void {
        const key = `${this.PREFIX}${participants}`;
        localStorage.removeItem(key);
        this.removeFromKeysList(key);

        // Reset cache + index vì data thay đổi
        this.cache = null;
        this.index = null;
    }

    // Lấy tất cả keys đã lưu trong localStorage (chỉ lấy danh sách key, chưa lấy data)
    static getAllKeys(): string[] {
        const keys = localStorage.getItem(this.KEYS_LIST);
        return keys ? JSON.parse(keys) : [];
    }

    // Lấy tất cả data từ localStorage (trả về mảng gồm { participants, data })
    static getAll(): { participants: number; data: SigmaData[] }[] {
        const keys = this.getAllKeys();
        const result: { participants: number; data: SigmaData[] }[] = [];

        keys.forEach(key => {
            const participants = parseInt(key.replace(this.PREFIX, ''));
            const data = this.get(participants);
            if (data) result.push({ participants, data });
        });

        return result;
    }

    // Lấy tất cả data nhưng có caching để lần sau gọi lại nhanh hơn
    static getAllCached() {
        if (!this.cache) this.cache = this.getAll();
        return this.cache;
    }

    // Xây dựng index để lookup nhanh theo childNodeId
    private static buildIndex() {
        if (this.index) return; // nếu index đã có thì bỏ qua
        this.index = new Map();
        const allData = this.getAllCached();
        for (const item of allData) {
            for (const entry of item.data) {
                this.index.set(entry.childNode, entry);
            }
        }
    }

    // Tìm dữ liệu theo childNodeId (O(1) vì lookup trong Map)
    static findByChildNode(childNodeId: number): SigmaData | null {
        this.buildIndex();
        return this.index?.get(childNodeId) || null;
    }

    /**
     * Tìm dữ liệu theo childNodeId trong bảng participants cụ thể
     * @param childNodeId - ID của child node cần tìm
     * @param participants - Số lượng participants để xác định bảng cần tìm
     * @returns SigmaData nếu tìm thấy, null nếu không tìm thấy
     */
    static findByChildNodeInParticipants(childNodeId: number, participants: number): SigmaData | null {
        const data = this.get(participants);
        if (!data) return null;

        return data.find(entry => entry.childNode === childNodeId) || null;
    }

    // Tìm dữ liệu theo parentNodeId trong bảng participants cụ thể
    static findByParentNodeInParticipants(parentNodeId: number, participants: number): SigmaData | null {
        const data = this.get(participants);
        if (!data) return null;

        return data.find(entry => entry.parentNode === parentNodeId) || null;
    }

    // Cập nhật danh sách key trong localStorage khi thêm mới
    private static updateKeysList(newKey: string): void {
        const existingKeys = this.getAllKeys();
        if (!existingKeys.includes(newKey)) {
            existingKeys.push(newKey);
            localStorage.setItem(this.KEYS_LIST, JSON.stringify(existingKeys));
        }
    }

    // Xóa key khỏi danh sách key khi remove data
    private static removeFromKeysList(keyToRemove: string): void {
        const existingKeys = this.getAllKeys();
        const updatedKeys = existingKeys.filter(key => key !== keyToRemove);
        localStorage.setItem(this.KEYS_LIST, JSON.stringify(updatedKeys));
    }
}
