export function getErrorMessage(error) {
  if (!error) {
    return "Có lỗi xảy ra, vui lòng thử lại sau";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return "Có lỗi xảy ra, vui lòng thử lại sau";
}
