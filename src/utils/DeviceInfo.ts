interface ExtendedNavigator extends Navigator {
    oscpu?: string;
}

export function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    // Lưu uniqueId vào localStorage để giữ cố định trên cùng 1 trình duyệt
    let uniqueId = localStorage.getItem('device_unique_id');
    if (!uniqueId) {
        uniqueId = crypto.randomUUID(); // hoặc Date.now().toString() nếu muốn đơn giản hơn
        localStorage.setItem('device_unique_id', uniqueId);
    }

    return {
        brand: platform, // hoặc để trống nếu muốn
        model: userAgent, // chuỗi mô tả trình duyệt & hệ điều hành
        systemName: (navigator as ExtendedNavigator).oscpu || platform,
        systemVersion: '', // không thể lấy chính xác version hệ điều hành
        uniqueId,
    };
}
