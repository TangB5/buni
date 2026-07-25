export type AppleLoginSuccess = {
  authorization: {
    code: string;
    id_token: string;
  };

  user?: {
    email?: string;
    name?: {
      firstName?: string;
      lastName?: string;
    };
  };
};

export type AppleLoginButtonProps = {
  disabled?: boolean;

  onSuccess?: (response: AppleLoginSuccess) => void;

  onError?: (error: unknown) => void;
};