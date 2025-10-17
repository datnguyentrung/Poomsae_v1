import type { TournamentMatchDTO, KeyInfo, RelationInfo } from '@/types/Tournament/TournamentMatch';

/**
 * Utility functions for traversing tournament matches as linked list
 */

/**
 * Creates a map of matches by their key for O(1) lookup
 */
export const createMatchMap = (matches: TournamentMatchDTO[]): Map<string, TournamentMatchDTO> => {
    const map = new Map<string, TournamentMatchDTO>();
    matches.forEach(match => {
        const key = createMatchKey(match.keyInfo);
        map.set(key, match);
    });
    return map;
};

/**
 * Creates a unique key from KeyInfo
 */
export const createMatchKey = (keyInfo: KeyInfo): string => {
    return `${keyInfo.tournament}-${keyInfo.idCombination}-${keyInfo.targetNode}`;
};

/**
 * Finds the head (first) match in the linked list
 * A head match has no leftMatch pointing to it
 */
export const findHeadMatch = (matches: TournamentMatchDTO[]): TournamentMatchDTO | null => {
    // 1️⃣ Tìm match được đánh dấu là "đầu danh sách"
    const firstNodeMatch = matches.find(match => match.keyInfo.firstNode);
    if (firstNodeMatch) return firstNodeMatch;

    // 2️⃣ Nếu không có match nào được đánh dấu là đầu danh sách
    //    => ta phải tự tìm "đầu" bằng cách xem match nào không bị ai trỏ tới
    const rightMatchKeys = new Set<string>();

    // 3️⃣ Duyệt toàn bộ danh sách, lấy ra danh sách các match
    //     mà ai đó trỏ tới thông qua `relationInfo.rightMatch`
    matches.forEach(match => {
        if (match.relationInfo.rightMatch) {
            const key = createMatchKey(match.relationInfo.rightMatch);
            rightMatchKeys.add(key);
        }
    });

    // 4️⃣ Giờ ta có một tập hợp `rightMatchKeys`
    //     chứa "toàn bộ node bị trỏ tới ở bên phải".
    //     Ta sẽ tìm node nào KHÔNG nằm trong tập đó
    //     => tức là node này KHÔNG bị ai trỏ tới
    for (const match of matches) {
        const key = createMatchKey(match.keyInfo);
        if (!rightMatchKeys.has(key)) {
            return match; // Đây chính là node đầu danh sách
        }
    }

    // 5️⃣ Nếu vẫn không tìm thấy, trả về match đầu tiên trong mảng (phòng lỗi)
    return matches[0] || null;
};

/**
 * Traverses the linked list from head to tail and returns ordered array
 */
export const traverseMatchLinkedList = (matches: TournamentMatchDTO[]): TournamentMatchDTO[] => {
    if (matches.length === 0) return [];

    const matchMap = createMatchMap(matches);
    const result: TournamentMatchDTO[] = [];
    const visited = new Set<string>();

    // Find head match
    let currentMatch = findHeadMatch(matches);

    if (!currentMatch) return matches; // Fallback if can't find head

    // Traverse from head to tail
    while (currentMatch) {
        const currentKey = createMatchKey(currentMatch.keyInfo);

        // Prevent infinite loops
        if (visited.has(currentKey)) {
            console.warn('Circular reference detected in match linked list at:', currentKey);
            break;
        }

        visited.add(currentKey);
        result.push(currentMatch);

        // Move to next match (rightMatch)
        if (currentMatch.relationInfo.rightMatch) {
            const nextKey = createMatchKey(currentMatch.relationInfo.rightMatch);
            currentMatch = matchMap.get(nextKey) || null;
        } else {
            currentMatch = null; // End of list
        }
    }

    // Add any unvisited matches (orphaned nodes)
    matches.forEach(match => {
        const key = createMatchKey(match.keyInfo);
        if (!visited.has(key)) {
            result.push(match);
        }
    });

    return result;
};

/**
 * Finds the tail (last) match in the linked list
 */
export const findTailMatch = (matches: TournamentMatchDTO[]): TournamentMatchDTO | null => {
    if (matches.length === 0) return null;

    // Find match that has no rightMatch
    const tailMatch = matches.find(match => !match.relationInfo.rightMatch);
    return tailMatch || matches[matches.length - 1]; // Fallback to last match
};

/**
 * Inserts a new match after a specific match in the linked list
 * Returns the updated relationInfo for both matches
 */
export const insertMatchAfter = (
    targetMatch: TournamentMatchDTO,
    newMatchKeyInfo: KeyInfo
): { targetUpdate: RelationInfo; newMatchRelation: RelationInfo } => {
    const targetUpdate: RelationInfo = {
        leftMatch: targetMatch.relationInfo.leftMatch,
        rightMatch: newMatchKeyInfo // Point to new match
    };

    const newMatchRelation: RelationInfo = {
        leftMatch: targetMatch.keyInfo, // Point back to target
        rightMatch: targetMatch.relationInfo.rightMatch // Take target's right
    };

    return { targetUpdate, newMatchRelation };
};

/**
 * Validates the linked list integrity
 */
export const validateLinkedList = (matches: TournamentMatchDTO[]): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];
    const matchMap = createMatchMap(matches);

    matches.forEach(match => {
        const currentKey = createMatchKey(match.keyInfo);

        // Check if leftMatch exists
        if (match.relationInfo.leftMatch) {
            const leftKey = createMatchKey(match.relationInfo.leftMatch);
            if (!matchMap.has(leftKey)) {
                errors.push(`Match ${currentKey} references non-existent leftMatch ${leftKey}`);
            }
        }

        // Check if rightMatch exists
        if (match.relationInfo.rightMatch) {
            const rightKey = createMatchKey(match.relationInfo.rightMatch);
            if (!matchMap.has(rightKey)) {
                errors.push(`Match ${currentKey} references non-existent rightMatch ${rightKey}`);
            }
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
};