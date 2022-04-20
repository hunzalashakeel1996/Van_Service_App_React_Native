// set notification popup visible when data is received from remote or local
export const setNotificationVisible = (data) => {
  return {
    type: 'SET_NOTIFICATION_VISIBLE',
    data
  }
};

// set platform value (ios, android)
export const setPlatformValue = (data) => {
  return {
    type: 'SET_PLATFORM_VALUE',
    data
  }
};