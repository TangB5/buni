export interface UserSettings {
  notifications: {
    emailComments: boolean;
    emailDownloads: boolean;
    emailValidations: boolean;
    emailNewsletter: boolean;
    pushBrowser: boolean;
    pushValidations: boolean;
  };
  privacy: {
    profilePublic: boolean;
    showEmail: boolean;
    showLocation: boolean;
    allowIndexing: boolean;
    shareAnalytics: boolean;
  };
  security: {
    twoFAEnabled: boolean;
  };
}

export interface UpdateSettingsDto {
  emailComments?: boolean;
  emailDownloads?: boolean;
  emailValidations?: boolean;
  emailNewsletter?: boolean;
  pushBrowser?: boolean;
  pushValidations?: boolean;
  profilePublic?: boolean;
  showEmail?: boolean;
  showLocation?: boolean;
  allowIndexing?: boolean;
  shareAnalytics?: boolean;
  twoFAEnabled?: boolean;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
