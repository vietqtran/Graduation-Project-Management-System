import mongoose, { ClientSession } from 'mongoose';

/**
 * Hàm xử lý transaction chuyên nghiệp hơn, giúp tái sử dụng.
 * @param fn Hàm chứa business logic cần thực hiện trong transaction
 * @returns Kết quả của transaction
 */
export const runTransaction = async <T>(fn: (session: ClientSession) => Promise<T>): Promise<T> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await fn(session); // Chạy logic trong transaction
    await session.commitTransaction(); // Commit nếu thành công
    return result;
  } catch (error) {
    await session.abortTransaction(); // Rollback nếu có lỗi
    throw error;
  } finally {
    session.endSession(); // Đóng session
  }
};
