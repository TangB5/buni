export interface UpdateProfileForm {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  twitter?: string;
  specialty?: string;
  avatar?: string;
}

export interface BecomeCuratorForm {
  bio: string;
  specialty: string;
  location: string;
  website?: string;
  github?: string;
  twitter?: string;
}

export interface FieldErrors {
  [key: string]: string;
}
