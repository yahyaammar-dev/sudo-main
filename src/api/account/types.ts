export type AccountVerificationResponse = {
  data: {
    id: string;
    verified: boolean;
  };
  success: boolean;
  message: string;
};
